import { useQuery } from "@tanstack/react-query";
import { Address } from "viem";

export interface TrustFund {
  name: string;
  description: string;
  avatar: string;
  strategyAddress: string;
}

export interface DashboardStats {
  totalDistributed: bigint;
  ongoingStreams: number;
  activeBeneficiaries: number;
}

const useTrustData = (userAddress?: Address) => {
  const activeFundsQuery = useQuery({
    queryKey: ["activeFunds", userAddress],
    queryFn: async () => {
      const response = await fetch(
        "http://localhost:8000/subgraphs/name/capy-strategy",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            query: `
            query GetActiveFunds($owner: String!) { # $limit: Int!
              strategyCreateds(
                where: { owner: $owner }
                orderBy: blockTimestamp
                orderDirection: desc
                first: $limit
              ) {
                name
                description
                avatar
                strategyAddress
              }
            }
          `,
            variables: { owner: userAddress, limit: 5 },
          }),
        }
      );

      const data = await response.json();
      return data.data.strategyCreateds as TrustFund[];
    },
    enabled: !!userAddress,
  });

  const dashboardStatsQuery = useQuery({
    queryKey: ["dashboardStats"],
    queryFn: async () => {
      const response = await fetch(
        "http://localhost:8000/subgraphs/name/capy-strategy",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            query: `
            query GetDashboardStats {
              distributionExecuteds {
                allocations
                recipientIds
                duration
                blockTimestamp
              }
            }
          `,
          }),
        }
      );

      const data = await response.json();
      const distributions = data.data.distributionExecuteds;
      const currentTime = Math.floor(Date.now() / 1000);

      let totalDistributed = BigInt(0);
      let ongoingStreams = 0;
      const activeBeneficiariesSet = new Set<string>();

      distributions.forEach((dist: any) => {
        // Calculate total distributed
        const distributionTotal = dist.allocations.reduce(
          (acc: bigint, curr: string) => acc + BigInt(curr),
          BigInt(0)
        );
        totalDistributed += distributionTotal;

        // Check if stream is active
        const endTime = Number(dist.blockTimestamp) + Number(dist.duration);
        if (endTime > currentTime) {
          ongoingStreams++;
          dist.recipientIds.forEach((id: string) =>
            activeBeneficiariesSet.add(id)
          );
        }
      });

      return {
        totalDistributed,
        ongoingStreams,
        activeBeneficiaries: activeBeneficiariesSet.size,
      } as DashboardStats;
    },
  });



  return {
    activeFunds: activeFundsQuery.data || [],
    dashboardStats: dashboardStatsQuery.data,
    isLoading:
      activeFundsQuery.isLoading ||
      dashboardStatsQuery.isLoading,
    error:
      activeFundsQuery.error ||
      dashboardStatsQuery.error 
  };
};

export default useTrustData;