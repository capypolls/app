const data = {
    name: "CapyCore",
    address: "0x81D9796e071D39CbEE043975002fFc03cbADc96f",
    abi: [
      {
        type: "constructor",
        inputs: [
          {
            name: "_cloneablePoll",
            type: "address",
            internalType: "address"
          },
          {
            name: "_cloneableToken",
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
            name: "initialOwner",
            type: "address",
            internalType: "address"
          }
        ],
        stateMutability: "nonpayable"
      },
      {
        type: "function",
        name: "MAX_DURATION",
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
        name: "MAX_PROTOCOL_FEE",
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
        name: "MIN_DURATION",
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
        name: "cloneablePoll",
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
        name: "cloneableToken",
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
        name: "createPoll",
        inputs: [
          {
            name: "initialStake",
            type: "uint256",
            internalType: "uint256"
          },
          {
            name: "question",
            type: "string",
            internalType: "string"
          },
          {
            name: "avatar",
            type: "string",
            internalType: "string"
          },
          {
            name: "description",
            type: "string",
            internalType: "string"
          },
          {
            name: "duration",
            type: "uint256",
            internalType: "uint256"
          },
          {
            name: "yesTokenName",
            type: "string",
            internalType: "string"
          },
          {
            name: "yesTokenSymbol",
            type: "string",
            internalType: "string"
          },
          {
            name: "noTokenName",
            type: "string",
            internalType: "string"
          },
          {
            name: "noTokenSymbol",
            type: "string",
            internalType: "string"
          }
        ],
        outputs: [
          {
            name: "pollAddress",
            type: "address",
            internalType: "address"
          }
        ],
        stateMutability: "nonpayable"
      },
      {
        type: "function",
        name: "getPollAt",
        inputs: [
          {
            name: "_index",
            type: "uint256",
            internalType: "uint256"
          }
        ],
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
        name: "getPollCount",
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
        name: "getPollDetails",
        inputs: [
          {
            name: "pollAddress",
            type: "address",
            internalType: "address"
          }
        ],
        outputs: [
          {
            name: "exists",
            type: "bool",
            internalType: "bool"
          },
          {
            name: "description",
            type: "string",
            internalType: "string"
          }
        ],
        stateMutability: "view"
      },
      {
        type: "function",
        name: "isPollFromFactory",
        inputs: [
          {
            name: "_pollAddress",
            type: "address",
            internalType: "address"
          }
        ],
        outputs: [
          {
            name: "",
            type: "bool",
            internalType: "bool"
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
        name: "pollDescriptions",
        inputs: [
          {
            name: "",
            type: "address",
            internalType: "address"
          }
        ],
        outputs: [
          {
            name: "",
            type: "string",
            internalType: "string"
          }
        ],
        stateMutability: "view"
      },
      {
        type: "function",
        name: "polls",
        inputs: [
          {
            name: "",
            type: "uint256",
            internalType: "uint256"
          }
        ],
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
        name: "protocolFee",
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
        name: "renounceOwnership",
        inputs: [],
        outputs: [],
        stateMutability: "nonpayable"
      },
      {
        type: "function",
        name: "setProtocolFee",
        inputs: [
          {
            name: "newFee",
            type: "uint256",
            internalType: "uint256"
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
            internalType: "address"
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
        name: "updateCloneablePollAddress",
        inputs: [
          {
            name: "_cloneablePoll",
            type: "address",
            internalType: "address"
          }
        ],
        outputs: [],
        stateMutability: "nonpayable"
      },
      {
        type: "function",
        name: "updateCloneableTokenAddress",
        inputs: [
          {
            name: "_cloneableToken",
            type: "address",
            internalType: "address"
          }
        ],
        outputs: [],
        stateMutability: "nonpayable"
      },
      {
        type: "function",
        name: "updateSUSDETokenAddress",
        inputs: [
          {
            name: "_susdeToken",
            type: "address",
            internalType: "address"
          }
        ],
        outputs: [],
        stateMutability: "nonpayable"
      },
      {
        type: "function",
        name: "updateUSDETokenAddress",
        inputs: [
          {
            name: "_usdeToken",
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
            internalType: "address"
          }
        ],
        stateMutability: "view"
      },
      {
        type: "function",
        name: "withdrawFees",
        inputs: [
          {
            name: "to",
            type: "address",
            internalType: "address"
          }
        ],
        outputs: [],
        stateMutability: "nonpayable"
      },
      {
        type: "event",
        name: "CloneablePollUpdated",
        inputs: [
          {
            name: "oldAddress",
            type: "address",
            indexed: false,
            internalType: "address"
          },
          {
            name: "newAddress",
            type: "address",
            indexed: false,
            internalType: "address"
          }
        ],
        anonymous: false
      },
      {
        type: "event",
        name: "CloneableTokenUpdated",
        inputs: [
          {
            name: "oldAddress",
            type: "address",
            indexed: false,
            internalType: "address"
          },
          {
            name: "newAddress",
            type: "address",
            indexed: false,
            internalType: "address"
          }
        ],
        anonymous: false
      },
      {
        type: "event",
        name: "FeesWithdrawn",
        inputs: [
          {
            name: "to",
            type: "address",
            indexed: false,
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
        name: "PollCreated",
        inputs: [
          {
            name: "creator",
            type: "address",
            indexed: true,
            internalType: "address"
          },
          {
            name: "pollAddress",
            type: "address",
            indexed: false,
            internalType: "address"
          },
          {
            name: "yesToken",
            type: "address",
            indexed: false,
            internalType: "address"
          },
          {
            name: "noToken",
            type: "address",
            indexed: false,
            internalType: "address"
          },
          {
            name: "question",
            type: "string",
            indexed: false,
            internalType: "string"
          },
          {
            name: "avatar",
            type: "string",
            indexed: false,
            internalType: "string"
          },
          {
            name: "description",
            type: "string",
            indexed: false,
            internalType: "string"
          }
        ],
        anonymous: false
      },
      {
        type: "event",
        name: "ProtocolFeeUpdated",
        inputs: [
          {
            name: "oldFee",
            type: "uint256",
            indexed: false,
            internalType: "uint256"
          },
          {
            name: "newFee",
            type: "uint256",
            indexed: false,
            internalType: "uint256"
          }
        ],
        anonymous: false
      },
      {
        type: "event",
        name: "SUSDETokenUpdated",
        inputs: [
          {
            name: "oldAddress",
            type: "address",
            indexed: false,
            internalType: "address"
          },
          {
            name: "newAddress",
            type: "address",
            indexed: false,
            internalType: "address"
          }
        ],
        anonymous: false
      },
      {
        type: "event",
        name: "USDETokenUpdated",
        inputs: [
          {
            name: "oldAddress",
            type: "address",
            indexed: false,
            internalType: "address"
          },
          {
            name: "newAddress",
            type: "address",
            indexed: false,
            internalType: "address"
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
        name: "ERC1167FailedCreateClone",
        inputs: []
      },
      {
        type: "error",
        name: "FailedInnerCall",
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
        name: "ReentrancyGuardReentrantCall",
        inputs: []
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