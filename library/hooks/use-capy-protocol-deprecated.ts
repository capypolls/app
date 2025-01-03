import { simulateContract, writeContract } from "@wagmi/core";
import { useCallback } from "react";

import { config } from "@/providers/wagmi/config";
import useStore from "@/store";
import allo from "@/types/contracts/allo";
import CapyUSDeStakeRouter from "@/types/contracts/capy-usde-stake-router";
import capyCore from "@/types/contracts/capy-core-deprecated";
import capyStrategy from "@/types/contracts/capy-strategy";
import capyStrategyFactory from "@/types/contracts/capy-strategy-factory";
import registry from "@/types/contracts/registry";
import {
  Address,
  encodeAbiParameters,
  erc20Abi,
  parseAbiParameters,
  parseUnits,
  zeroAddress,
} from "viem";
import { getBytecode, readContract } from "wagmi/actions";
import drips from "@/types/contracts/drips";

const DRIPS_ADDRESS = drips.address as `0x${string}`;

const REGISTRY_ADDRESS = registry.address as `0x${string}`;
const ALLO_ADDRESS = allo.address as `0x${string}`;
const CAPY_USDE_STAKE_ROUTER_ADDRESS =
  CapyUSDeStakeRouter.address as `0x${string}`;
const CAPY_STRATEGY_FACTORY_ADDRESS =
  capyStrategyFactory.address as `0x${string}`;
const CAPY_CORE_ADDRESS = capyCore.address as `0x${string}`;

const DRIPS_ABI = drips.abi;
const REGISTRY_ABI = registry.abi;
const ALLO_ABI = allo.abi;
const CAPY_USDE_STAKE_ROUTER_ABI = CapyUSDeStakeRouter.abi;
const CAPY_STRATEGY_ABI = capyStrategy.abi;
const CAPY_STRATEGY_FACTORY_ABI = capyStrategyFactory.abi;
const CAPY_CORE_ABI = capyCore.abi;

type Metadata = {
  protocol: bigint;
  pointer: string;
};

type FunctionParams = {
  createProfile: {
    nonce: bigint;
    name: string;
    metadata: Metadata;
    owner: Address;
    members: Address[];
  };
  approveUSDeRouter: {
    token: Address;
    address: Address;
    amount: bigint;
  };
  createStrategy: {
    name: string;
    avatarUrl?: string;
    description?: string;
  };
  createPool: {
    profileId: `0x${string}`;
    strategy: Address;
    initStrategyData: `0x${string}`;
    token: Address;
    amount: bigint;
    metadata: Metadata;
    managers: Address[];
  };
  fundPool: {
    poolId: bigint;
    amount: bigint;
  };
  deployTrust: {
    name: string;
    avatarUrl?: string;
    description?: string;
    address: Address;
    amount: bigint;
    registrationStartTimestamp: number;
    registrationEndTimestamp: number;
    allocationStartTimestamp: number;
    allocationEndTimestamp: number;
  };
  registerRecipient: {
    poolId: bigint;
    data: {
      recipientAddress: Address;
      name: string;
      avatarUrl?: string;
      bio: string;
    };
  };
  updateRecipientStatus: {
    recipientId: Address;
    strategyAddress: Address;
    status: number;
  };
  allocate: {
    poolId: bigint;
    data: `0x${string}`;
  };
  distribute: {
    poolId: bigint;
    recipientIds: Address[];
    data: `0x${string}`;
  };
  fundsOut: {
    poolId: bigint;
    capyNftId: bigint;
    recipient: Address;
    maxCycles: number;
    token: Address;
  };
};

const useCapyProtocol = () => {
  const { profile, token } = useStore();
  const createProfile = useCallback(
    async (params: FunctionParams["createProfile"]) => {
      try {
        const { request, result } = await simulateContract(config, {
          abi: REGISTRY_ABI,
          address: REGISTRY_ADDRESS,
          functionName: "createProfile",
          args: [
            params.nonce,
            params.name,
            params.metadata,
            params.owner,
            params.members,
          ],
        });

        const receipt = await writeContract(config, request);
        return { id: result, createProfileTx: receipt };
      } catch (error) {
        throw error;
      }
    },
    []
  );

  const getTokenDecimals = async (tokenAddress: Address) => {
    const decimals = await readContract(config, {
      abi: erc20Abi,
      address: tokenAddress,
      functionName: "decimals",
    });
    return decimals;
  };

  const createStrategy = async (params: FunctionParams["createStrategy"]) => {
    const { request, result } = await simulateContract(config, {
      abi: CAPY_STRATEGY_FACTORY_ABI,
      address: CAPY_STRATEGY_FACTORY_ADDRESS,
      functionName: "createStrategy",
      args: [params.name, params.avatarUrl || "", params.description || ""],
    });

    const receipt = await writeContract(config, request);
    return { strategy: result, createStrategyTx: receipt };
  };

  const approveUSDeRouter = async (
    params: FunctionParams["approveUSDeRouter"]
  ) => {
    const allowance = await readContract(config, {
      abi: erc20Abi,
      address: params.token,
      functionName: "allowance",
      args: [params.address, CAPY_USDE_STAKE_ROUTER_ADDRESS],
    });

    // If allowance is sufficient, no need to approve again
    if (allowance >= params.amount) {
      return zeroAddress;
    }

    const { request } = await simulateContract(config, {
      abi: erc20Abi,
      address: params.token,
      functionName: "approve",
      args: [CAPY_USDE_STAKE_ROUTER_ADDRESS, params.amount],
    });

    return writeContract(config, request);
  };

  const createPool = async (params: FunctionParams["createPool"]) => {
    const { request, result } = await simulateContract(config, {
      abi: ALLO_ABI,
      address: ALLO_ADDRESS,
      functionName: "createPoolWithCustomStrategy",
      args: [
        params.profileId,
        params.strategy,
        params.initStrategyData,
        params.token,
        params.amount,
        params.metadata,
        params.managers,
      ],
    });
    const receipt = await writeContract(config, request);

    // Wait for pool creation transaction to be mined
    let poolExists = false;
    while (!poolExists) {
      try {
        // Try to read from the pool to verify it exists
        const pool = await readContract(config, {
          abi: ALLO_ABI,
          address: ALLO_ADDRESS,
          functionName: "getPool",
          args: [result],
        });

        // Verify pool data exists and is valid
        if (pool.strategy !== zeroAddress) {
          poolExists = true;
        } else {
          await new Promise((resolve) => setTimeout(resolve, 1000));
        }
      } catch (error) {
        // If error occurs (pool not found yet), wait and retry
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
    }

    return { poolId: result, createPoolTx: receipt };
  };

  const fundPool = async (params: FunctionParams["fundPool"]) => {
    const { request } = await simulateContract(config, {
      abi: CAPY_USDE_STAKE_ROUTER_ABI,
      address: CAPY_USDE_STAKE_ROUTER_ADDRESS,
      functionName: "fundAlloPool",
      args: [params.poolId, params.amount],
    });
    return writeContract(config, request);
  };

  const deployTrust = useCallback(
    async (params: FunctionParams["deployTrust"]) => {
      if (!profile.id || !token) {
        throw new Error("Please initialize your trust fund space first");
      }

      const decimals = await getTokenDecimals(token.USDe);
      params.amount = parseUnits(params.amount.toString(), decimals);

      const approveUSDeRouterTx = await approveUSDeRouter({
        token: token.USDe,
        address: params.address,
        amount: params.amount,
      });

      const { strategy, createStrategyTx } = await createStrategy(params);

      // Wait for strategy to be deployed and verified
      let strategyExists = false;
      while (!strategyExists) {
        try {
          const code = await getBytecode(config, {
            address: strategy,
          });
          if (code !== "0x" && code) {
            strategyExists = true;
          } else {
            // Wait 1 second before checking again
            await new Promise((resolve) => setTimeout(resolve, 1000));
          }
        } catch (error) {
          // If error occurs (e.g. contract not found), wait and retry
          await new Promise((resolve) => setTimeout(resolve, 1000));
        }
      }

      const { poolId, createPoolTx } = await createPool({
        ...params,
        amount: BigInt(0),
        profileId: profile.id,
        strategy,
        initStrategyData: encodeAbiParameters(
          parseAbiParameters("uint64, uint64, uint64, uint64"),
          [
            BigInt(params.registrationStartTimestamp),
            BigInt(params.registrationEndTimestamp),
            BigInt(params.allocationStartTimestamp),
            BigInt(params.allocationEndTimestamp),
          ]
        ),
        token: token.sUSDe,
        metadata: {
          protocol: BigInt(0),
          pointer: "",
        },
        managers: [],
      });

      // Fund the pool using the router
      const fundPoolTx = await fundPool({
        poolId,
        amount: params.amount,
      });

      return {
        createStrategyTx,
        approveUSDeRouterTx,
        createPoolTx,
        fundPoolTx,
      };
    },
    [profile, token]
  );

  const registerRecipient = useCallback(
    async (params: FunctionParams["registerRecipient"]) => {
      const { request } = await simulateContract(config, {
        abi: ALLO_ABI,
        address: ALLO_ADDRESS,
        functionName: "registerRecipient",
        args: [
          params.poolId,
          encodeAbiParameters(
            parseAbiParameters("address, string, string, string"),
            [
              params.data.recipientAddress,
              params.data.name,
              params.data.avatarUrl || "",
              params.data.bio,
            ]
          ),
        ],
      });
      return writeContract(config, request);
    },
    []
  );

  const updateRecipientStatus = useCallback(
    async (params: FunctionParams["updateRecipientStatus"]) => {
      const { request } = await simulateContract(config, {
        abi: CAPY_STRATEGY_ABI,
        address: params.strategyAddress,
        functionName: "updateRecipientStatus",
        args: [params.recipientId, params.status],
      });
      return writeContract(config, request);
    },
    []
  );

  const allocate = useCallback(async (params: FunctionParams["allocate"]) => {
    const { request } = await simulateContract(config, {
      abi: ALLO_ABI,
      address: ALLO_ADDRESS,
      functionName: "allocate",
      args: [params.poolId, params.data],
    });
    return writeContract(config, request);
  }, []);

  const distribute = useCallback(
    async (params: FunctionParams["distribute"]) => {
      const { request } = await simulateContract(config, {
        abi: ALLO_ABI,
        address: ALLO_ADDRESS,
        functionName: "distribute",
        args: [params.poolId, params.recipientIds, params.data],
      });
      return writeContract(config, request);
    },
    []
  );

  const findOptimalCycles = async (
    accountId: bigint,
    erc20TokenAddress: Address,
    maxCycles: number
  ) => {
    let left = 0;
    let right = maxCycles;
    let minNonZeroCycle = -1;
    let maxReceivableCycle = -1;
    let maxReceivableAmount = BigInt(0);

    // Binary search to find the minimum non-zero cycle
    while (left <= right) {
      const mid = Math.floor((left + right) / 2);
      const receivable = await readContract(config, {
        address: DRIPS_ADDRESS,
        abi: DRIPS_ABI,
        functionName: "receiveStreamsResult",
        args: [accountId, erc20TokenAddress, mid],
      });

      if (receivable > BigInt(0)) {
        minNonZeroCycle = mid;
        right = mid - 1;
      } else {
        left = mid + 1;
      }
    }

    // If no non-zero cycle found, return null
    if (minNonZeroCycle === -1) return null;

    // Find the maximum receivable cycle
    left = minNonZeroCycle;
    right = maxCycles;

    while (left <= right) {
      const mid = Math.floor((left + right) / 2);
      const receivable = await readContract(config, {
        address: DRIPS_ADDRESS,
        abi: DRIPS_ABI,
        functionName: "receiveStreamsResult",
        args: [accountId, erc20TokenAddress, mid],
      });

      if (receivable > maxReceivableAmount) {
        maxReceivableCycle = mid;
        maxReceivableAmount = receivable;
        left = mid + 1;
      } else {
        right = mid - 1;
      }
    }

    return { minNonZeroCycle, maxReceivableCycle, maxReceivableAmount };
  };

  const fundsOut = useCallback(async (params: FunctionParams["fundsOut"]) => {
    const { request } = await simulateContract(config, {
      abi: CAPY_CORE_ABI,
      address: CAPY_CORE_ADDRESS,
      functionName: "transfer",
      args: [
        params.poolId,
        params.capyNftId,
        params.recipient,
        params.maxCycles,
        params.token,
      ],
    });
    return writeContract(config, request);
  }, []);

  return {
    createProfile,
    deployTrust,
    registerRecipient,
    updateRecipientStatus,
    allocate,
    distribute,
    findOptimalCycles,
    fundsOut,
  };
};

export default useCapyProtocol;
