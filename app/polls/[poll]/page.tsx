"use client";

import { format, formatDistanceToNow } from "date-fns";
import { ArrowUpRight, Check, Loader } from "lucide-react";
import { useParams } from "next/navigation";
import { Address } from "viem";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/atoms/avatar";
import { Button } from "@/components/atoms/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/atoms/card";
import { Input } from "@/components/atoms/input";
import { Separator } from "@/components/atoms/separator";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/atoms/tabs";
import { RadialChart } from "@/components/organisms/radial-chart";
import { YesNoChart } from "@/components/organisms/yes-no-chart";
import { useMounted } from "@/hooks/use-mounted";
import { ellipsisAddress, getInitials, isValidUrl } from "@/utils";
import usePollData from "@/hooks/use-poll-data";

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

const Poll = () => {
  const params = useParams();
  const isMounted = useMounted();
  const { strategy, isLoading, error, winner } = usePollData(
    params.poll as Address
  );

  const currentTime = BigInt(Math.floor(Date.now() / 1000));
  const isRegistrationOpen =
    strategy?.registrationStartTime &&
    strategy?.registrationEndTime &&
    currentTime >= strategy.registrationStartTime &&
    currentTime <= strategy.registrationEndTime;

  if (!isMounted) return null;
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <Loader className="animate-spin text-gray-500 mt-36 mb-4" size={24} />
        <p className="text-gray-700">Loading poll...</p>
      </div>
    );
  }
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4">
        {error?.message}
      </div>
    );
  }
  if (!strategy?.strategyAddress) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4 mt-32">
        Poll does not exist yet
      </div>
    );
  }

  return (
    <div className="flex-1 space-y-4  p-6">
      <div className=" flex md:gap-6 flex-col md:flex-row">
        <div className=" flex flex-col md:w-2/5 gap-6">
          <div className="flex gap-2">
            <Avatar>
              <AvatarImage
                src={
                  isValidUrl(strategy?.avatar ?? "")
                    ? strategy?.avatar
                    : `https://avatar.vercel.sh/${
                        (strategy?.strategyAddress ?? "") +
                        (strategy?.name ?? "")
                      }`
                }
                alt={`${strategy?.name ?? "Poll"} logo`}
              />
              <AvatarFallback>
                {getInitials(strategy?.name ?? "")}
              </AvatarFallback>
            </Avatar>

            <h2 className="text-3xl font-bold tracking-tight">
              {strategy.name}
            </h2>
          </div>

          <div className=" ">
            <p className=" text-gray-800">{strategy.description}</p>
            {!isRegistrationOpen && strategy?.registrationEndTime && (
              <p className="text-sm text-gray-500 mt-2">
                Registration closed{" "}
                {formatDistanceToNow(
                  new Date(Number(strategy.registrationEndTime) * 1000),
                  { addSuffix: true }
                )}{" "}
                (ended{" "}
                {format(
                  new Date(Number(strategy.registrationEndTime) * 1000),
                  "PPp"
                )}
                )
              </p>
            )}
            {isRegistrationOpen &&
              strategy?.registrationStartTime &&
              strategy?.registrationEndTime && (
                <p className="text-sm text-gray-500 mt-2">
                  Registration open:{" "}
                  {formatDistanceToNow(
                    new Date(Number(strategy.registrationEndTime) * 1000),
                    { addSuffix: true }
                  )}{" "}
                  remaining (from{" "}
                  {format(
                    new Date(Number(strategy.registrationStartTime) * 1000),
                    "PPp"
                  )}{" "}
                  to{" "}
                  {format(
                    new Date(Number(strategy.registrationEndTime) * 1000),
                    "PPp"
                  )}
                  )
                </p>
              )}
          </div>

          <div className="">
            <Card className=" flex">
              <div className=" w-1/2">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Poll Contract
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {ellipsisAddress(strategy.strategyAddress)}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Deployed{" "}
                    {formatDistanceToNow(
                      new Date(strategy.blockTimestamp * 1000),
                      {
                        addSuffix: true,
                      }
                    )}
                  </p>
                </CardContent>
              </div>

              <div className=" w-1 flex items-center">
                <Separator orientation="vertical" className=" h-3/4" />
              </div>

              <div className=" w-1/2">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total Staked
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center text-2xl font-bold">
                    {/* TODO: change from poolSize */}
                    {Number(strategy.poolSize).toFixed(3)}&nbsp;{" "}
                    <span className="text-lg font-medium">USDe</span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    +0% from last month
                  </p>
                </CardContent>
              </div>
            </Card>
          </div>
        </div>

        <div className=" w-1 hidden md:block">
          <Separator orientation="vertical" className="" />
        </div>

        <Tabs defaultValue="polls" className=" space-y-4 md:w-3/5 pt-6 md:pt-0">
          <div className="flex border-b ">
            <TabsList className=" bg-white">
              <TabsTrigger
                value="polls"
                className=" data-[state=active]:border-b-2 data-[state=active]:border-green-300 rounded-none  data-[state=active]:shadow-none text-lg"
              >
                Market
              </TabsTrigger>
              <TabsTrigger
                value="activities"
                className=" data-[state=active]:border-b-2 data-[state=active]:border-green-300 rounded-none  data-[state=active]:shadow-none text-lg"
              >
                Activities
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="polls" className="space-y-10">
            <YesNoChart />

            {isRegistrationOpen ? (
              <>
                <div className=" flex gap-5 pt-5">
                  <Input
                    placeholder="Enter stake amount (USDe)"
                    className="h-12"
                  />
                  <RadialChart />
                </div>
                <div className=" flex  gap-8 ">
                  <Button className="w-full h-12 bg-green-500 hover:bg-green-400">
                    Stake YES
                  </Button>
                  <Button className="w-full h-12 bg-red-500 hover:bg-red-400">
                    Stake NO
                  </Button>
                </div>
              </>
            ) : (
              <div className=" border border-gray-200 p-8 rounded-2xl justify-between items-end mt-10">
                <div className=" pb-3">
                  <div className=" flex gap-3 items-center">
                    <div
                      className={` ${
                        winner === "Yes" ? " bg-green-200" : " bg-red-200"
                      } min-w-12 h-12 rounded-full grid place-items-center`}
                    >
                      <Check
                        size={30}
                        strokeWidth={3}
                        className={` ${
                          winner === "Yes" ? " text-green-500" : " text-red-500"
                        }`}
                      />
                    </div>
                    <h2 className="text-2xl font-semibold leading-none tracking-tight">
                      Results are in! {winner} Won 🎯
                    </h2>
                  </div>
                  <p className=" text-gray-800 text-lg pt-2">
                    For {winner} voters, your tokens retain their full
                    value—boosted by the interest yield from everyone&apos;s
                    stakes. Hold or trade your {winner} tokens as you like. You
                    can also withdraw your USDE stake anytime. <br />
                    For {winner === "Yes" ? " No" : " Yes"} voters, prepare for
                    the double-blitz with 500x inflation in 24 hours and another
                    500x in 48 hours. Withdraw your USDE stake—it&apos;s
                    no-loss, and your
                    {winner === "Yes" ? " No" : " Yes"} tokens are now purely
                    for entertainment!{" "}
                  </p>
                </div>
                <div className=" flex justify-end">
                  <button className="bg-[#33CB82] hover:bg-[#33CB82]/80 rounded-[14px] h-[50px] px-4 flex items-center gap-5">
                    Withdraw Funds
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

export default Poll;
