"use client";

import * as React from "react";
import { ArrowUpRight, Check, Loader } from "lucide-react";
import { useParams } from "next/navigation";
import {
  Address,
  encodeAbiParameters,
  parseAbiParameters,
  parseEther,
  parseUnits,
  getAddress,
  pad,
  formatEther,
} from "viem";
import { formatDistanceToNow, format } from "date-fns";
import { Lock } from "lucide-react";
import { toast } from "sonner";
import { waitForTransactionReceipt } from "wagmi/actions";

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/atoms/tabs";
import FundStats from "@/components/molecules/fund-stats";
import Beneficiary from "@/components/organisms/beneficiary-profile";
import NewTrustFundApplication from "@/components/organisms/trust-fund-application";
import useFundData from "@/hooks/use-fund-data";
//import { useMounted } from "@/hooks/use-mounted";
import { ellipsisAddress, getInitials, isValidUrl } from "@/utils";
import ParticipantProfile, {
  Participant,
} from "@/components/organisms/participant-profile";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/atoms/avatar";
import { defineStepper } from "@stepperize/react";
import { Button } from "@/components/atoms/button";
import { Input } from "@/components/atoms/input";
import { Separator } from "@/components/atoms/separator";

import { YesNoChart } from "@/components/organisms/yes-no-chart";
import { RadialChart } from "@/components/organisms/radial-chart";
import { opBNBTestnet, sepolia } from "wagmi/chains";
import useCapyProtocol from "@/hooks/use-capy-protocol";
import { useMounted } from "@/hooks/use-mounted";
import { config } from "@/providers/wagmi/config";

const { useStepper } = defineStepper(
  {
    id: "registration",
    title: "Registration",
    description: "Register participants",
  },
  {
    id: "allocation",
    title: "Allocation",
    description: "Allocate resources",
  },
  {
    id: "distribution",
    title: "Distribution",
    description: "Distribute funds",
  }
);

const recentActivity = [
  {
    id: "1",
    user: "Marcelo",
    action: "staked",
    choice: "Yes",
    amount: 77.11,
    timestamp: new Date(),
    teamLogo: "https://picsum.photos/200/200?random=101",
  },
  {
    id: "2",
    user: "hYlQDLDfDXFuWhNT",
    action: "staked",
    choice: "No",
    amount: 48.79,
    timestamp: new Date(),
    teamLogo: "https://picsum.photos/200/200?random=200",
  },
  {
    id: "3",
    user: "AidanAdelynn",
    action: "staked",
    choice: "No",
    amount: 20.0,
    timestamp: new Date(),
    teamLogo: "https://picsum.photos/200/200?random=300",
  },
];

const Fund = () => {
  const params = useParams();
  const pollAddress = params.fund as Address;
  const isMounted = useMounted();
  const stepper = useStepper();
  const isAdmin = true;
  const { stakeYes, stakeNo, withdrawFunds, formatAmount, getPollDetails, approveUSDe } = useCapyProtocol();

  const [isStaking, setIsStaking] = React.useState(false);
  const [isWithdrawing, setIsWithdrawing] = React.useState(false);
  const [stakeAmount, setStakeAmount] = React.useState("");
  const [pollData, setPollData] = React.useState<any>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<Error | null>(null);

  // Fetch poll details
  React.useEffect(() => {
    const fetchPollDetails = async () => {
      try {
        setIsLoading(true);
        const details = await getPollDetails({ pollAddress });
        setPollData(details);
      } catch (err) {
        setError(err as Error);
        console.error("Error fetching poll details:", err);
      } finally {
        setIsLoading(false);
      }
    };

    if (pollAddress) {
      fetchPollDetails();
    }
  }, [pollAddress, getPollDetails]);

  const handleStakeYes = async () => {
    if (!stakeAmount) return;
    
    setIsStaking(true);
    try {
      const formattedAmount = formatAmount(stakeAmount);
      const approveTx = await approveUSDe(pollAddress, formattedAmount);
      // Wait for approve transaction
      const approveReceipt = await waitForTransactionReceipt(config, {
        hash: approveTx
      });
      console.log("Approval successful:", approveReceipt.transactionHash);

      const stakeYesTx = await stakeYes(pollAddress, formattedAmount);
      const stakeYesReceipt = await waitForTransactionReceipt(config, {
        hash: stakeYesTx,
      });
      console.log("Staking YES successful:", stakeYesReceipt.transactionHash);
      toast.success("Successfully staked YES position");
      setStakeAmount("");
      
      // Refetch poll details after successful stake
      const updatedDetails = await getPollDetails({ pollAddress });
      setPollData(updatedDetails);
    } catch (error) {
      console.error("Error staking YES:", error);
      toast.error("Failed to stake YES position");
    } finally {
      setIsStaking(false);
    }
  };

  const handleStakeNo = async () => {
    if (!stakeAmount) return;
    
    setIsStaking(true);
    try {
      const formattedAmount = formatAmount(stakeAmount);
      const approveTx = await approveUSDe(pollAddress, formattedAmount);
        // Wait for approve transaction
      const approveReceipt = await waitForTransactionReceipt(config, {
        hash: approveTx
      });
      console.log("Approval successful:", approveReceipt.transactionHash);

      const stakeNoTx = await stakeNo(pollAddress, formattedAmount);
      const stakeNoReceipt = await waitForTransactionReceipt(config, {
        hash: stakeNoTx,
      });
      
      console.log("Staking NO successful:", stakeNoReceipt.transactionHash);
      toast.success("Successfully staked NO position");
      setStakeAmount("");
      
      // Refetch poll details after successful stake
      const updatedDetails = await getPollDetails({ pollAddress });
      setPollData(updatedDetails);
    } catch (error) {
      console.error("Error staking NO:", error);
      toast.error("Failed to stake NO position");
    } finally {
      setIsStaking(false);
    }
  };

  const handleWithdraw = async () => {
    setIsWithdrawing(true);
    try {
      //const tx = await withdrawFunds({ pollAddress: fund });
      const withdrawTx = await withdrawFunds({ pollAddress: pollAddress });
    
      const withdrawReceipt = await waitForTransactionReceipt(config, {
        hash: withdrawTx
      });
      
      console.log("Withdrawal successful:", withdrawReceipt.transactionHash);
      toast.success("Successfully withdrew funds");
    } catch (error) {
      console.error("Error withdrawing funds:", error);
      toast.error("Failed to withdraw funds");
    } finally {
      setIsWithdrawing(false);
    }
  };

  type YesNo = "Yes" | "No";

  const currentTime = BigInt(Math.floor(Date.now() / 1000));
  const winner: YesNo = "No";

  if (!isMounted) return null;
  if (!pollData) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <Loader className="animate-spin text-gray-500 mt-36 mb-4" size={24} />
        <p className="text-gray-700">Loading poll details...</p>
      </div>
    );
  }

  if (!pollData.exists) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4 mt-32">
        Poll does not exist
      </div>
    );
  }
  
// Only calculate isPollActive after we know pollData exists
  const isPollActive = !pollData.pollInfo.isResolved && 
    currentTime <= pollData.pollInfo.endTimestamp;

  return (
    <div className="flex-1 space-y-4 p-6">
      <div className="flex md:gap-6 flex-col md:flex-row">
        <div className="flex flex-col md:w-2/5 gap-6">
          <div className="flex gap-2">
            <Avatar>
              <AvatarImage
                src={`https://avatar.vercel.sh/${pollAddress}`}
                alt="Poll Avatar"
              />
              <AvatarFallback>
                {getInitials(pollData.description)}
              </AvatarFallback>
            </Avatar>
            <h2 className="text-3xl font-bold tracking-tight">
               {/* Ethena become the top DeFi protocol by TVL in Q1 2025? */}
              {pollData.description}
            </h2>
          </div>

          <div>
            <p className="text-gray-800">
              {pollData.description}
              {/* Ethena must rank as the top DeFi protocol by TVL on DeFiLlama for
              at least 7 consecutive days in Q1 2025, with TVL measured in USD
              from genuine user deposits; disqualifications include hacks over
              $10M, prolonged pauses, or TVL manipulation. */}
            </p>
            <p className="text-sm text-gray-500 mt-2">
              Ends {formatDistanceToNow(new Date(Number(pollData.pollInfo.endTimestamp) * 1000), { addSuffix: true })}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 border rounded-lg">
              <h3 className="font-semibold">Total YES Staked</h3>
              <p className="text-2xl">{formatEther(pollData.stats.totalYesStaked)} USDe</p>
            </div>
            <div className="p-4 border rounded-lg">
              <h3 className="font-semibold">Total NO Staked</h3>
              <p className="text-2xl">{formatEther(pollData.stats.totalNoStaked)} USDe</p>
            </div>
          </div>
        </div>

        <div className="w-1 hidden md:block">
          <Separator orientation="vertical" className="" />
        </div>

        <Tabs defaultValue="polls" className="space-y-4 md:w-3/5 pt-6 md:pt-0">
          <div className="flex border-b">
            <TabsList className="bg-white">
              <TabsTrigger
                value="polls"
                className="data-[state=active]:border-b-2 data-[state=active]:border-green-300 rounded-none data-[state=active]:shadow-none text-lg"
              >
                Market
              </TabsTrigger>
              <TabsTrigger
                value="activities"
                className="data-[state=active]:border-b-2 data-[state=active]:border-green-300 rounded-none data-[state=active]:shadow-none text-lg"
              >
                Activities
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="polls" className="space-y-10">
            <YesNoChart />

            {isPollActive ? (
              <>
                <div className="flex gap-5 pt-5">
                  <Input
                    type="number"
                    value={stakeAmount}
                    onChange={(e) => setStakeAmount(e.target.value)}
                    placeholder="Enter stake amount (USDe)"
                    className="h-12"
                    // disabled={isStaking}
                  />
                  <RadialChart />
                </div>
                <div className="flex gap-8">
                  <Button
                    onClick={handleStakeYes}
                    disabled={isStaking || !stakeAmount}
                    className="w-full h-12 bg-green-500 hover:bg-green-400"
                  >
                    {isStaking ? "Staking..." : "Stake YES"}
                  </Button>
                  <Button
                    onClick={handleStakeNo}
                    disabled={isStaking || !stakeAmount}
                    className="w-full h-12 bg-red-500 hover:bg-red-400"
                  >
                    {isStaking ? "Staking..." : "Stake NO"}
                  </Button>
                </div>
              </>
            ) : (
              <div className="border border-gray-200 p-8 rounded-2xl justify-between items-end mt-10">
                <div className="pb-3">
                  <div className="flex gap-3 items-center">
                    <div
                      className={`${
                        (winner as YesNo) === "Yes"
                          ? "bg-green-200"
                          : "bg-red-200"
                      } min-w-12 h-12 rounded-full grid place-items-center`}
                    >
                      <Check
                        size={30}
                        strokeWidth={3}
                        className={`${
                          (winner as YesNo) === "Yes"
                            ? "text-green-500"
                            : "text-red-500"
                        }`}
                      />
                    </div>
                    <h2 className="text-2xl font-semibold leading-none tracking-tight">
                      Results are in! {winner} Won 🎯
                    </h2>
                  </div>
                  <p className="text-gray-800 text-lg pt-2">
                    For {winner} voters, your tokens retain their full
                    value—boosted by the interest yield from everyone&apos;s
                    stakes. Hold or trade your {winner} tokens as you like. You
                    can also withdraw your USDE stake anytime. <br />
                    For {(winner as YesNo) === "Yes" ? "No" : "Yes"} voters,
                    prepare for the double-blitz with 500x inflation in 24 hours
                    and another 500x in 48 hours. Withdraw your USDE
                    stake—it&apos;s no-loss, and your
                    {(winner as YesNo) === "Yes" ? "No" : "Yes"} tokens are
                    now purely for entertainment!{" "}
                  </p>
                </div>
                <div className="flex justify-end">
                  <button
                    onClick={handleWithdraw}
                    disabled={isWithdrawing}
                    className="bg-[#33CB82] hover:bg-[#33CB82]/80 rounded-[14px] h-[50px] px-4 flex items-center gap-5"
                  >
                    {isWithdrawing ? "Withdrawing..." : "Withdraw Funds"}
                    <div className="w-7 h-7 rounded-full bg-[#191A23] flex justify-center items-center">
                      <ArrowUpRight
                        strokeWidth={3}
                        width={16}
                        className=" text-green-500 "
                      />
                    </div>
                  </button>
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="activities" className="space-y-4">
            <div className="space-y-8">
              {recentActivity.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-3 justify-between"
                >
                  <img
                    src={item.teamLogo}
                    alt=""
                    className="w-8 h-8 rounded-full"
                  />
                  <div className="flex-1">
                    <div className="text-sm">
                      <span className="font-medium">{item.user}</span>{" "}
                      {item.action}{" "}
                      <span
                        className={
                          item.choice === "Yes"
                            ? "text-green-600"
                            : "text-red-600"
                        }
                      >
                        {item.choice}
                      </span>{" "}
                      at (${item.amount})
                    </div>
                  </div>
                  <div className="text-sm text-gray-500">
                    {formatDistanceToNow(item.timestamp, { addSuffix: true })}
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Fund;
