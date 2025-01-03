const data = {
  name: "CapyCore",
  address: "0x3A7F069b2dD19D2B05fAAEA2AAD9a95c83174099",
  abi: [
    {
      type: "constructor",
      inputs: [
        {
          name: "_nftDriverAddress",
          type: "address",
          internalType: "address",
        },
        { name: "_dripsContract", type: "address", internalType: "address" },
        { name: "_capyNFTAddress", type: "address", internalType: "address" },
      ],
      stateMutability: "nonpayable",
    },
    {
      type: "function",
      name: "capyNFT",
      inputs: [],
      outputs: [
        { name: "", type: "address", internalType: "contract ICapyNFT" },
      ],
      stateMutability: "view",
    },
    {
      type: "function",
      name: "capyNftToDripsAccount",
      inputs: [{ name: "", type: "uint256", internalType: "uint256" }],
      outputs: [{ name: "", type: "uint256", internalType: "uint256" }],
      stateMutability: "view",
    },
    {
      type: "function",
      name: "dripsContract",
      inputs: [],
      outputs: [{ name: "", type: "address", internalType: "contract IDrips" }],
      stateMutability: "view",
    },
    {
      type: "function",
      name: "getAvailableBalance",
      inputs: [
        { name: "capyNftId", type: "uint256", internalType: "uint256" },
        { name: "token", type: "address", internalType: "contract IERC20" },
      ],
      outputs: [{ name: "", type: "uint256", internalType: "uint256" }],
      stateMutability: "view",
    },
    {
      type: "function",
      name: "getStreamConfig",
      inputs: [
        { name: "poolId", type: "uint256", internalType: "uint256" },
        { name: "token", type: "address", internalType: "contract IERC20" },
        { name: "recipient", type: "address", internalType: "address" },
      ],
      outputs: [
        { name: "startTime", type: "uint256", internalType: "uint256" },
        { name: "stopTime", type: "uint256", internalType: "uint256" },
        { name: "amountPerSecond", type: "uint256", internalType: "uint256" },
      ],
      stateMutability: "view",
    },
    {
      type: "function",
      name: "handleDistribution",
      inputs: [
        { name: "poolId", type: "uint256", internalType: "uint256" },
        { name: "token", type: "address", internalType: "contract IERC20" },
        { name: "recipients", type: "address[]", internalType: "address[]" },
        { name: "allocations", type: "uint256[]", internalType: "uint256[]" },
        { name: "duration", type: "uint32", internalType: "uint32" },
        {
          name: "whitelistedCollectors",
          type: "address[]",
          internalType: "address[]",
        },
      ],
      outputs: [],
      stateMutability: "nonpayable",
    },
    {
      type: "function",
      name: "nftDriver",
      inputs: [],
      outputs: [
        { name: "", type: "address", internalType: "contract INFTDriver" },
      ],
      stateMutability: "view",
    },
    {
      type: "function",
      name: "poolIdToCapyNFTs",
      inputs: [
        { name: "", type: "uint256", internalType: "uint256" },
        { name: "", type: "uint256", internalType: "uint256" },
      ],
      outputs: [{ name: "", type: "bool", internalType: "bool" }],
      stateMutability: "view",
    },
    {
      type: "function",
      name: "poolIdToDripsAccount",
      inputs: [{ name: "", type: "uint256", internalType: "uint256" }],
      outputs: [{ name: "", type: "uint256", internalType: "uint256" }],
      stateMutability: "view",
    },
    {
      type: "function",
      name: "poolIdToWhitelistedCollectors",
      inputs: [
        { name: "", type: "uint256", internalType: "uint256" },
        { name: "", type: "address", internalType: "address" },
      ],
      outputs: [{ name: "", type: "bool", internalType: "bool" }],
      stateMutability: "view",
    },
    {
      type: "function",
      name: "squeezeStreams",
      inputs: [
        { name: "capyNftId", type: "uint256", internalType: "uint256" },
        { name: "token", type: "address", internalType: "contract IERC20" },
        { name: "senderId", type: "uint256", internalType: "uint256" },
        { name: "historyHash", type: "bytes32", internalType: "bytes32" },
        {
          name: "streamsHistory",
          type: "tuple[]",
          internalType: "struct IDrips.StreamsHistory[]",
          components: [
            { name: "streamsHash", type: "bytes32", internalType: "bytes32" },
            {
              name: "receivers",
              type: "tuple[]",
              internalType: "struct IDrips.StreamReceiver[]",
              components: [
                {
                  name: "accountId",
                  type: "uint256",
                  internalType: "uint256",
                },
                {
                  name: "config",
                  type: "uint256",
                  internalType: "IDrips.StreamConfig",
                },
              ],
            },
            { name: "updateTime", type: "uint32", internalType: "uint32" },
            { name: "maxEnd", type: "uint32", internalType: "uint32" },
          ],
        },
      ],
      outputs: [],
      stateMutability: "nonpayable",
    },
    {
      type: "function",
      name: "transfer",
      inputs: [
        { name: "poolId", type: "uint256", internalType: "uint256" },
        { name: "capyNftId", type: "uint256", internalType: "uint256" },
        { name: "recipient", type: "address", internalType: "address" },
        { name: "maxCycles", type: "uint32", internalType: "uint32" },
        { name: "token", type: "address", internalType: "contract IERC20" },
      ],
      outputs: [
        { name: "collected", type: "uint128", internalType: "uint128" },
      ],
      stateMutability: "nonpayable",
    },
    {
      type: "function",
      name: "whitelistedCollectorsCount",
      inputs: [{ name: "", type: "uint256", internalType: "uint256" }],
      outputs: [{ name: "", type: "uint256", internalType: "uint256" }],
      stateMutability: "view",
    },
    {
      type: "event",
      name: "DistributionHandled",
      inputs: [
        {
          name: "poolId",
          type: "uint256",
          indexed: true,
          internalType: "uint256",
        },
        {
          name: "token",
          type: "address",
          indexed: true,
          internalType: "contract IERC20",
        },
      ],
      anonymous: false,
    },
    {
      type: "event",
      name: "FundsTransferred",
      inputs: [
        {
          name: "poolId",
          type: "uint256",
          indexed: true,
          internalType: "uint256",
        },
        {
          name: "capyNftId",
          type: "uint256",
          indexed: true,
          internalType: "uint256",
        },
        {
          name: "recipient",
          type: "address",
          indexed: true,
          internalType: "address",
        },
        {
          name: "collected",
          type: "uint128",
          indexed: false,
          internalType: "uint128",
        },
      ],
      anonymous: false,
    },
    {
      type: "event",
      name: "StreamSetup",
      inputs: [
        {
          name: "poolId",
          type: "uint256",
          indexed: true,
          internalType: "uint256",
        },
        {
          name: "token",
          type: "address",
          indexed: false,
          internalType: "contract IERC20",
        },
        {
          name: "recipient",
          type: "address",
          indexed: true,
          internalType: "address",
        },
        {
          name: "recipientDriverAccountId",
          type: "uint256",
          indexed: true,
          internalType: "uint256",
        },
        {
          name: "capyNftId",
          type: "uint256",
          indexed: false,
          internalType: "uint256",
        },
        {
          name: "amountPerSecond",
          type: "uint256",
          indexed: false,
          internalType: "uint256",
        },
        {
          name: "duration",
          type: "uint32",
          indexed: false,
          internalType: "uint32",
        },
        {
          name: "totalAllocation",
          type: "uint256",
          indexed: false,
          internalType: "uint256",
        },
      ],
      anonymous: false,
    },
    {
      type: "event",
      name: "WhitelistedCollectorUpdated",
      inputs: [
        {
          name: "poolId",
          type: "uint256",
          indexed: true,
          internalType: "uint256",
        },
        {
          name: "collector",
          type: "address",
          indexed: true,
          internalType: "address",
        },
        {
          name: "isWhitelisted",
          type: "bool",
          indexed: false,
          internalType: "bool",
        },
      ],
      anonymous: false,
    },
  ],
} as const;

export default data;
