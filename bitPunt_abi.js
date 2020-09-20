var abi = [
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "amountBet",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "newBalance",
        "type": "uint256"
      }
    ],
    "name": "BetPlaced",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "userCard",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "string",
        "name": "betChoice",
        "type": "string"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "houseCard",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "string",
        "name": "winner",
        "type": "string"
      }
    ],
    "name": "DrawOutResult",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "payoutAmount",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "address",
        "name": "recipient",
        "type": "address"
      }
    ],
    "name": "Payout",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "rollResult",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "choice",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "string",
        "name": "winner",
        "type": "string"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "payoutAmount",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "address",
        "name": "recipient",
        "type": "address"
      }
    ],
    "name": "Results",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "string",
        "name": "flipResult",
        "type": "string"
      },
      {
        "indexed": false,
        "internalType": "string",
        "name": "choice",
        "type": "string"
      },
      {
        "indexed": false,
        "internalType": "string",
        "name": "winner",
        "type": "string"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "payoutAmount",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "address",
        "name": "recipient",
        "type": "address"
      }
    ],
    "name": "Results",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "amountWithdrawn",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "address",
        "name": "toAccount",
        "type": "address"
      }
    ],
    "name": "contractBalanceWithdrawn",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "amountDeposited",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "address",
        "name": "fromAccount",
        "type": "address"
      }
    ],
    "name": "contractDepositMade",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "amountDeposited",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "address",
        "name": "fromAccount",
        "type": "address"
      }
    ],
    "name": "depositMade",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "amountWithdrawn",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "address",
        "name": "toAccount",
        "type": "address"
      }
    ],
    "name": "fundsWithdrawn",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "address",
        "name": "user",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "balance",
        "type": "uint256"
      }
    ],
    "name": "userAdded",
    "type": "event"
  },
  {
    "constant": false,
    "inputs": [],
    "name": "Destroy",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [],
    "name": "addBettingFunds",
    "outputs": [],
    "payable": true,
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [],
    "name": "depositToContract",
    "outputs": [],
    "payable": true,
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [
      {
        "internalType": "uint256",
        "name": "amountToBet",
        "type": "uint256"
      }
    ],
    "name": "drawHouseCard",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "card",
        "type": "uint256"
      }
    ],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [
      {
        "internalType": "bool",
        "name": "high",
        "type": "bool"
      }
    ],
    "name": "drawUserCard",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [
      {
        "internalType": "uint256",
        "name": "amountToBet",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "betChoice",
        "type": "uint256"
      }
    ],
    "name": "flipIt",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "owner",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "randomNumberHouse",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "result",
        "type": "uint256"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "randomNumberUser",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "result",
        "type": "uint256"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [
      {
        "internalType": "uint256",
        "name": "amountToBet",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "choice",
        "type": "uint256"
      }
    ],
    "name": "rollIt",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [],
    "name": "withdrawBettingFunds",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [],
    "name": "withdrawContractBalance",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "getContractInfo",
    "outputs": [
      {
        "internalType": "address",
        "name": "contractAddress",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "balance",
        "type": "uint256"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "getUserInfo",
    "outputs": [
      {
        "internalType": "address",
        "name": "user",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "balance",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "flipChoice",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "rollChoice",
        "type": "uint256"
      },
      {
        "internalType": "bool",
        "name": "betHigh",
        "type": "bool"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "getResults",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "flipOut",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "rollOut",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "drawOutUser",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "drawOutHouse",
        "type": "uint256"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  }
]
