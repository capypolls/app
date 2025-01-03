import { simulateContract, writeContract } from "@wagmi/core";
import { useCallback } from "react";
import { config } from "@/providers/wagmi/config";
import useStore from "@/store";
import capyCore from "@/types/contracts/capy-core";
import capyPoll from "@/types/contracts/capy-poll";
import pollToken from "@/types/contracts/poll-token";
import { readContract, getBytecode } from "wagmi/actions";
import {
  Address,
  encodeAbiParameters,
  erc20Abi,
  parseAbiParameters,
  parseUnits,
  zeroAddress,
} from "viem";

const CAPY_CORE_ADDRESS = capyCore.address as `0x${string}`;
const CAPY_POLL_ABI = capyPoll.abi;
const CAPY_CORE_ABI = capyCore.abi;
const USDE_TOKEN_ADDRESS = "0x9E1eF5A92C9Bf97460Cd00C0105979153EA45b27" as `0x${string}`

// Types for function parameters
type FunctionParams = {
  createPoll: {
    initialStake: bigint;
    question: string;
    avatar: string;
    description: string;
    duration: bigint;
    yesTokenName: string;
    yesTokenSymbol: string;
    noTokenName: string;
    noTokenSymbol: string;
  };
  stake: {
    pollAddress: Address;
    amount: bigint;
    position: boolean; // true for YES, false for NO
  };
  withdrawFunds: {
    pollAddress: Address;
  };
  getPollDetails: {
    pollAddress: Address;
  };
  approve: {
    token: Address;
    spender: Address;
    amount: bigint;
  };
};

const useCapyProtocol = () => {
  // Complex operation with multiple contract interactions - keep useCallback
  const createPoll = useCallback(async (params: FunctionParams["createPoll"]) => {
    try {
      const { request } = await simulateContract(config, {
        abi: CAPY_CORE_ABI,
        address: CAPY_CORE_ADDRESS,
        functionName: "createPoll",
        args: [
          params.initialStake,
          params.question,
          params.avatar,
          params.description,
          params.duration,
          params.yesTokenName,
          params.yesTokenSymbol,
          params.noTokenName,
          params.noTokenSymbol,
        ],
      });
      const receipt = await writeContract(config, request);
      return {createPollTx: receipt };
      
      //return writeContract(config, request);
    } catch (error) {
      console.error("Error creating poll:", error);
      throw error;
    }
  }, []);

  // Stake Function (works for both YES and NO positions)
  const stake = async (params: FunctionParams["stake"]) => {
    try {
      const { request } = await simulateContract(config, {
        abi: CAPY_POLL_ABI,
        address: params.pollAddress,
        functionName: "stake",
        args: [params.amount, params.position],
      });
      return writeContract(config, request);
    } catch (error) {
      console.error("Error staking:", error);
      throw error;
    }
  };

  // Simple wrapper functions - remove useCallback
  const stakeYes = async (pollAddress: Address, amount: bigint) => {
    return stake({
      pollAddress,
      amount,
      position: true,
    });
  };

  const stakeNo = async (pollAddress: Address, amount: bigint) => {
    return stake({
      pollAddress,
      amount,
      position: false,
    });
  };

    // Approve Function
    const approve = useCallback(async (params: FunctionParams["approve"]) => {
      try {
        const { request } = await simulateContract(config, {
          abi: erc20Abi,
          address: params.token,
          functionName: "approve",
          args: [params.spender, params.amount],
        });
        return writeContract(config, request);
      } catch (error) {
        console.error("Error approving token:", error);
        throw error;
      }
    }, []);
  
    
  // Simple wrapper for USDe approval
  const approveUSDe = async (spender: Address, amount: bigint) => {
    return approve({
      token: USDE_TOKEN_ADDRESS,
      spender,
      amount,
    });
  };

  // Contract interaction that might be passed down - keep useCallback
  const withdrawFunds = useCallback(async (params: FunctionParams["withdrawFunds"]) => {
    try {
      const { request } = await simulateContract(config, {
        abi: CAPY_POLL_ABI,
        address: params.pollAddress,
        functionName: "withdrawStake",
        args: [],
      });
      return writeContract(config, request);
    } catch (error) {
      console.error("Error withdrawing funds:", error);
      throw error;
    }
  }, []);

  // Get Poll Details Function
  // Complex operation with multiple reads - keep useCallback
  const getPollDetails = useCallback(async (params: FunctionParams["getPollDetails"]) => {
    try {
      const [exists, description] = await readContract(config, {
        abi: CAPY_CORE_ABI,
        address: CAPY_CORE_ADDRESS,
        functionName: "getPollDetails",
        args: [params.pollAddress],
      });

      // If poll exists, get additional info from the poll contract
      if (exists) {
        const pollInfo = await readContract(config, {
          abi: CAPY_POLL_ABI,
          address: params.pollAddress,
          functionName: "getPollInfo",
        });

        // Get current epoch info
        const currentEpoch = await readContract(config, {
          abi: CAPY_POLL_ABI,
          address: params.pollAddress,
          functionName: "currentEpoch",
        });

        // Get total staked amounts
        const [totalYesStaked, totalNoStaked] = await Promise.all([
          readContract(config, {
            abi: CAPY_POLL_ABI,
            address: params.pollAddress,
            functionName: "totalYesStaked",
          }),
          readContract(config, {
            abi: CAPY_POLL_ABI,
            address: params.pollAddress,
            functionName: "totalNoStaked",
          }),
        ]);

        return {
          exists,
          description,
          pollInfo: {
            endTimestamp: pollInfo.endTimestamp,
            yesToken: pollInfo.yesToken,
            noToken: pollInfo.noToken,
            totalStaked: pollInfo.totalStaked,
            isResolved: pollInfo.isResolved,
            winningPosition: pollInfo.winningPosition,
          },
          currentEpoch,
          stats: {
            totalYesStaked,
            totalNoStaked,
          },
        };
      }

      return {
        exists: false,
        description: "",
        pollInfo: null,
        currentEpoch: BigInt(0),
        stats: {
          totalYesStaked: BigInt(0),
          totalNoStaked: BigInt(0),
        },
      };
    } catch (error) {
      console.error("Error getting poll details:", error);
      throw error;
    }
  }, []);

  // Simple utility function - remove useCallback
  const formatAmount = (amount: string | number) => {
    try {
      return parseUnits(amount.toString(), 18); // Assuming 18 decimals for tokens
    } catch (error) {
      console.error("Error formatting amount:", error);
      throw error;
    }
  };

  return {
    // Core functions
    createPoll,
    stake,
    stakeYes,
    stakeNo,
    withdrawFunds,
    getPollDetails,
    
    // Utilities
    formatAmount,
    approve,
    approveUSDe
  };
};

export default useCapyProtocol;