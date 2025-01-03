const data = {
    name: "CapyPoll",
    abi: [
      {
        type: "function",
        name: "BATCH_SIZE",
        inputs: [],
        outputs: [
          {
            name: "",
            type: "uint256",
            internalType: "uint256"
          }
        ],
        stateMutability: "view"
      },
      {
        type: "function",
        name: "CREATOR_REWARD_PERCENTAGE",
        inputs: [],
        outputs: [
          {
            name: "",
            type: "uint256",
            internalType: "uint256"
          }
        ],
        stateMutability: "view"
      },
      {
        type: "function",
        name: "DISTRIBUTION_PERCENTAGE",
        inputs: [],
        outputs: [
          {
            name: "",
            type: "uint256",
            internalType: "uint256"
          }
        ],
        stateMutability: "view"
      },
      {
        type: "function",
        name: "EPOCH_1_DISTRIBUTION",
        inputs: [],
        outputs: [
          {
            name: "",
            type: "uint256",
            internalType: "uint256"
          }
        ],
        stateMutability: "view"
      },
      {
        type: "function",
        name: "EPOCH_2_DISTRIBUTION",
        inputs: [],
        outputs: [
          {
            name: "",
            type: "uint256",
            internalType: "uint256"
          }
        ],
        stateMutability: "view"
      },
      {
        type: "function",
        name: "EPOCH_3_DISTRIBUTION",
        inputs: [],
        outputs: [
          {
            name: "",
            type: "uint256",
            internalType: "uint256"
          }
        ],
        stateMutability: "view"
      },
      {
        type: "function",
        name: "EPOCH_4_DISTRIBUTION",
        inputs: [],
        outputs: [
          {
            name: "",
            type: "uint256",
            internalType: "uint256"
          }
        ],
        stateMutability: "view"
      },
      {
        type: "function",
        name: "MAX_TOKEN_SUPPLY",
        inputs: [],
        outputs: [
          {
            name: "",
            type: "uint256",
            internalType: "uint256"
          }
        ],
        stateMutability: "view"
      },
      {
        type: "function",
        name: "PAID_LIST_PERCENTAGE",
        inputs: [],
        outputs: [
          {
            name: "",
            type: "uint256",
            internalType: "uint256"
          }
        ],
        stateMutability: "view"
      },
      {
        type: "function",
        name: "currentEpoch",
        inputs: [],
        outputs: [
          {
            name: "",
            type: "uint256",
            internalType: "uint256"
          }
        ],
        stateMutability: "view"
      },
      {
        type: "function",
        name: "distributeEpochRewards",
        inputs: [
          {
            name: "epochNumber",
            type: "uint256",
            internalType: "uint256"
          }
        ],
        outputs: [],
        stateMutability: "nonpayable"
      },
      {
        type: "function",
        name: "epochDuration",
        inputs: [],
        outputs: [
          {
            name: "",
            type: "uint256",
            internalType: "uint256"
          }
        ],
        stateMutability: "view"
      },
      {
        type: "function",
        name: "epochs",
        inputs: [
          {
            name: "",
            type: "uint256",
            internalType: "uint256"
          }
        ],
        outputs: [
          {
            name: "startTime",
            type: "uint256",
            internalType: "uint256"
          },
          {
            name: "endTime",
            type: "uint256",
            internalType: "uint256"
          },
          {
            name: "totalDistribution",
            type: "uint256",
            internalType: "uint256"
          },
          {
            name: "isDistributed",
            type: "bool",
            internalType: "bool"
          },
          {
            name: "totalEpochStaked",
            type: "uint256",
            internalType: "uint256"
          },
          {
            name: "lastProcessedIndex",
            type: "uint256",
            internalType: "uint256"
          }
        ],
        stateMutability: "view"
      },
      {
        type: "function",
        name: "getEpochInfo",
        inputs: [
          {
            name: "epochNumber",
            type: "uint256",
            internalType: "uint256"
          }
        ],
        outputs: [
          {
            name: "startTime",
            type: "uint256",
            internalType: "uint256"
          },
          {
            name: "endTime",
            type: "uint256",
            internalType: "uint256"
          },
          {
            name: "totalDistribution",
            type: "uint256",
            internalType: "uint256"
          },
          {
            name: "isDistributed",
            type: "bool",
            internalType: "bool"
          },
          {
            name: "numStakers",
            type: "uint256",
            internalType: "uint256"
          }
        ],
        stateMutability: "view"
      },
      {
        type: "function",
        name: "getPollInfo",
        inputs: [],
        outputs: [
          {
            name: "",
            type: "tuple",
            internalType: "struct CapyPoll.PollInfo",
            components: [
              {
                name: "endTimestamp",
                type: "uint256",
                internalType: "uint256"
              },
              {
                name: "yesToken",
                type: "address",
                internalType: "address"
              },
              {
                name: "noToken",
                type: "address",
                internalType: "address"
              },
              {
                name: "totalStaked",
                type: "uint256",
                internalType: "uint256"
              },
              {
                name: "isResolved",
                type: "bool",
                internalType: "bool"
              },
              {
                name: "winningPosition",
                type: "bool",
                internalType: "bool"
              }
            ]
          }
        ],
        stateMutability: "view"
      },
      {
        type: "function",
        name: "getUserStakesForEpoch",
        inputs: [
          {
            name: "user",
            type: "address",
            internalType: "address"
          },
          {
            name: "epochNumber",
            type: "uint256",
            internalType: "uint256"
          }
        ],
        outputs: [
          {
            name: "",
            type: "tuple[]",
            internalType: "struct CapyPoll.Stake[]",
            components: [
              {
                name: "amount",
                type: "uint256",
                internalType: "uint256"
              },
              {
                name: "position",
                type: "bool",
                internalType: "bool"
              },
              {
                name: "withdrawn",
                type: "bool",
                internalType: "bool"
              }
            ]
          }
        ],
        stateMutability: "view"
      },
      {
        type: "function",
        name: "initialize",
        inputs: [
          {
            name: "_capyCore",
            type: "address",
            internalType: "address"
          },
          {
            name: "_pollCreator",
            type: "address",
            internalType: "address"
          },
          {
            name: "_usdeToken",
            type: "address",
            internalType: "address"
          },
          {
            name: "_susdeToken",
            type: "address",
            internalType: "address"
          },
          {
            name: "_duration",
            type: "uint256",
            internalType: "uint256"
          },
          {
            name: "_yesToken",
            type: "address",
            internalType: "address"
          },
          {
            name: "_noToken",
            type: "address",
            internalType: "address"
          }
        ],
        outputs: [],
        stateMutability: "nonpayable"
      },
      {
        type: "function",
        name: "numEpochs",
        inputs: [],
        outputs: [
          {
            name: "",
            type: "uint256",
            internalType: "uint256"
          }
        ],
        stateMutability: "view"
      },
      {
        type: "function",
        name: "owner",
        inputs: [],
        outputs: [
          {
            name: "",
            type: "address",
            internalType: "address"
          }
        ],
        stateMutability: "view"
      },
      {
        type: "function",
        name: "pollInfo",
        inputs: [],
        outputs: [
          {
            name: "endTimestamp",
            type: "uint256",
            internalType: "uint256"
          },
          {
            name: "yesToken",
            type: "address",
            internalType: "address"
          },
          {
            name: "noToken",
            type: "address",
            internalType: "address"
          },
          {
            name: "totalStaked",
            type: "uint256",
            internalType: "uint256"
          },
          {
            name: "isResolved",
            type: "bool",
            internalType: "bool"
          },
          {
            name: "winningPosition",
            type: "bool",
            internalType: "bool"
          }
        ],
        stateMutability: "view"
      },
      {
        type: "function",
        name: "renounceOwnership",
        inputs: [],
        outputs: [],
        stateMutability: "nonpayable"
      },
      {
        type: "function",
        name: "resolvePoll",
        inputs: [
          {
            name: "winningPosition",
            type: "bool",
            internalType: "bool"
          }
        ],
        outputs: [],
        stateMutability: "nonpayable"
      },
      {
        type: "function",
        name: "stake",
        inputs: [
          {
            name: "amount",
            type: "uint256",
            internalType: "uint256"
          },
          {
            name: "position",
            type: "bool",
            internalType: "bool"
          }
        ],
        outputs: [],
        stateMutability: "nonpayable"
      },
      {
        type: "function",
        name: "susdeToken",
        inputs: [],
        outputs: [
          {
            name: "",
            type: "address",
            internalType: "contract IERC20"
          }
        ],
        stateMutability: "view"
      },
      {
        type: "function",
        name: "totalNoStaked",
        inputs: [],
        outputs: [
          {
            name: "",
            type: "uint256",
            internalType: "uint256"
          }
        ],
        stateMutability: "view"
      },
      {
        type: "function",
        name: "totalYesStaked",
        inputs: [],
        outputs: [
          {
            name: "",
            type: "uint256",
            internalType: "uint256"
          }
        ],
        stateMutability: "view"
      },
      {
        type: "function",
        name: "transferOwnership",
        inputs: [
          {
            name: "newOwner",
            type: "address",
            internalType: "address"
          }
        ],
        outputs: [],
        stateMutability: "nonpayable"
      },
      {
        type: "function",
        name: "usdeToken",
        inputs: [],
        outputs: [
          {
            name: "",
            type: "address",
            internalType: "contract IERC20"
          }
        ],
        stateMutability: "view"
      },
      {
        type: "function",
        name: "withdrawStake",
        inputs: [],
        outputs: [],
        stateMutability: "nonpayable"
      },
      {
        type: "event",
        name: "Initialized",
        inputs: [
          {
            name: "version",
            type: "uint64",
            indexed: false,
            internalType: "uint64"
          }
        ],
        anonymous: false
      },
      {
        type: "event",
        name: "OwnershipTransferred",
        inputs: [
          {
            name: "previousOwner",
            type: "address",
            indexed: true,
            internalType: "address"
          },
          {
            name: "newOwner",
            type: "address",
            indexed: true,
            internalType: "address"
          }
        ],
        anonymous: false
      },
      {
        type: "event",
        name: "PollResolved",
        inputs: [
          {
            name: "winningPosition",
            type: "bool",
            indexed: false,
            internalType: "bool"
          }
        ],
        anonymous: false
      },
      {
        type: "event",
        name: "RewardsDistributed",
        inputs: [
          {
            name: "user",
            type: "address",
            indexed: true,
            internalType: "address"
          },
          {
            name: "amount",
            type: "uint256",
            indexed: false,
            internalType: "uint256"
          }
        ],
        anonymous: false
      },
      {
        type: "event",
        name: "StakeAdded",
        inputs: [
          {
            name: "user",
            type: "address",
            indexed: true,
            internalType: "address"
          },
          {
            name: "amount",
            type: "uint256",
            indexed: false,
            internalType: "uint256"
          },
          {
            name: "position",
            type: "bool",
            indexed: false,
            internalType: "bool"
          },
          {
            name: "epoch",
            type: "uint256",
            indexed: false,
            internalType: "uint256"
          }
        ],
        anonymous: false
      },
      {
        type: "event",
        name: "StakeWithdrawn",
        inputs: [
          {
            name: "user",
            type: "address",
            indexed: true,
            internalType: "address"
          },
          {
            name: "amount",
            type: "uint256",
            indexed: false,
            internalType: "uint256"
          }
        ],
        anonymous: false
      },
      {
        type: "event",
        name: "TokensDistributed",
        inputs: [
          {
            name: "epoch",
            type: "uint256",
            indexed: true,
            internalType: "uint256"
          },
          {
            name: "amount",
            type: "uint256",
            indexed: false,
            internalType: "uint256"
          }
        ],
        anonymous: false
      },
      {
        type: "error",
        name: "AddressEmptyCode",
        inputs: [
          {
            name: "target",
            type: "address",
            internalType: "address"
          }
        ]
      },
      {
        type: "error",
        name: "AddressInsufficientBalance",
        inputs: [
          {
            name: "account",
            type: "address",
            internalType: "address"
          }
        ]
      },
      {
        type: "error",
        name: "FailedInnerCall",
        inputs: []
      },
      {
        type: "error",
        name: "InvalidInitialization",
        inputs: []
      },
      {
        type: "error",
        name: "NotInitializing",
        inputs: []
      },
      {
        type: "error",
        name: "OwnableInvalidOwner",
        inputs: [
          {
            name: "owner",
            type: "address",
            internalType: "address"
          }
        ]
      },
      {
        type: "error",
        name: "OwnableUnauthorizedAccount",
        inputs: [
          {
            name: "account",
            type: "address",
            internalType: "address"
          }
        ]
      },
      {
        type: "error",
        name: "SafeERC20FailedOperation",
        inputs: [
          {
            name: "token",
            type: "address",
            internalType: "address"
          }
        ]
      }
    ]
  } as const;
  
  export default data;