import { getDefaultConfig } from "connectkit";
import { createConfig, http } from "wagmi";
import { anvil, sepolia, opBNBTestnet } from "wagmi/chains";

const isDev = process.env.NODE_ENV === 'development';

export const config = createConfig(
  getDefaultConfig({
    appName: "CapyFlows",
    walletConnectProjectId:
      process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || "",
    //chains: isDev ? [anvil] : [sepolia, opBNBTestnet],
    chains: [opBNBTestnet],
    multiInjectedProviderDiscovery: true,
    transports: {
      //[anvil.id]: http(),
      //[sepolia.id]: http("https://eth-sepolia.g.alchemy.com/v2/wmmPIFmPi700hZkT_QuBCKRvsCpvJ-J9"),
      [opBNBTestnet.id]: http("https://opbnb-testnet.g.alchemy.com/v2/wmmPIFmPi700hZkT_QuBCKRvsCpvJ-J9"),

    },
  })
);
