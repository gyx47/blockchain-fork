import React, { useState, useEffect, useCallback } from 'react';
// import { ethers } from 'ethers'; // 之前的导入方式
// const ethers = (window as any).ethers; // 从全局窗口对象获取 ethers (cast window to any to satisfy TypeScript)
import { ethers } from 'ethers';
// --- Contract ABI ---
// Replace with your actual contract ABI after compilation
const contractABI = [
    {
      "inputs": [],
      "stateMutability": "nonpayable",
      "type": "constructor"
    },
    {
      "inputs": [],
      "name": "ActivityAlreadySettled",
      "type": "error"
    },
    {
      "inputs": [],
      "name": "ActivityNotFound",
      "type": "error"
    },
    {
      "inputs": [],
      "name": "ActivityNotSettled",
      "type": "error"
    },
    {
      "inputs": [],
      "name": "AlreadyClaimed",
      "type": "error"
    },
    {
      "inputs": [],
      "name": "BettingClosed",
      "type": "error"
    },
    {
      "inputs": [],
      "name": "IncorrectPayment",
      "type": "error"
    },
    {
      "inputs": [],
      "name": "InvalidAmount",
      "type": "error"
    },
    {
      "inputs": [],
      "name": "InvalidOption",
      "type": "error"
    },
    {
      "inputs": [],
      "name": "NotApproved",
      "type": "error"
    },
    {
      "inputs": [],
      "name": "NotListed",
      "type": "error"
    },
    {
      "inputs": [],
      "name": "NotTicketOwner",
      "type": "error"
    },
    {
      "inputs": [],
      "name": "NotWinningTicket",
      "type": "error"
    },
    {
      "inputs": [],
      "name": "TicketNotListed",
      "type": "error"
    },
    {
      "inputs": [],
      "name": "TransferFailed",
      "type": "error"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "uint256",
          "name": "activityId",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "string",
          "name": "description",
          "type": "string"
        },
        {
          "indexed": false,
          "internalType": "string[]",
          "name": "options",
          "type": "string[]"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "endTime",
          "type": "uint256"
        }
      ],
      "name": "ActivityCreated",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "uint256",
          "name": "activityId",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "winningOption",
          "type": "uint256"
        }
      ],
      "name": "ActivitySettled",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "owner",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "approved",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "uint256",
          "name": "tokenId",
          "type": "uint256"
        }
      ],
      "name": "Approval",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "owner",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "operator",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "bool",
          "name": "approved",
          "type": "bool"
        }
      ],
      "name": "ApprovalForAll",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "tokenId",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "price",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "address",
          "name": "owner",
          "type": "address"
        }
      ],
      "name": "BetPlaced",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "uint256",
          "name": "tokenId",
          "type": "uint256"
        }
      ],
      "name": "ListingCancelled",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "previousOwner",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "newOwner",
          "type": "address"
        }
      ],
      "name": "OwnershipTransferred",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "uint256",
          "name": "tokenId",
          "type": "uint256"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "seller",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "price",
          "type": "uint256"
        }
      ],
      "name": "TicketListed",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "uint256",
          "name": "tokenId",
          "type": "uint256"
        },
        {
          "indexed": true,
          "internalType": "uint256",
          "name": "activityId",
          "type": "uint256"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "player",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "optionIndex",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "amount",
          "type": "uint256"
        }
      ],
      "name": "TicketPurchased",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "uint256",
          "name": "tokenId",
          "type": "uint256"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "seller",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "buyer",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "price",
          "type": "uint256"
        }
      ],
      "name": "TicketSold",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "from",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "to",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "uint256",
          "name": "tokenId",
          "type": "uint256"
        }
      ],
      "name": "Transfer",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "uint256",
          "name": "tokenId",
          "type": "uint256"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "player",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "amount",
          "type": "uint256"
        }
      ],
      "name": "WinningsClaimed",
      "type": "event"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "name": "activities",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "id",
          "type": "uint256"
        },
        {
          "internalType": "string",
          "name": "description",
          "type": "string"
        },
        {
          "internalType": "uint256",
          "name": "endTime",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "totalPool",
          "type": "uint256"
        },
        {
          "internalType": "address payable",
          "name": "notary",
          "type": "address"
        },
        {
          "internalType": "bool",
          "name": "settled",
          "type": "bool"
        },
        {
          "internalType": "uint256",
          "name": "winningOption",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "totalWinningAmount",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "to",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "tokenId",
          "type": "uint256"
        }
      ],
      "name": "approve",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "owner",
          "type": "address"
        }
      ],
      "name": "balanceOf",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_tokenId",
          "type": "uint256"
        }
      ],
      "name": "buyListedTicket",
      "outputs": [],
      "stateMutability": "payable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_activityId",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "_optionIndex",
          "type": "uint256"
        }
      ],
      "name": "buyTicket",
      "outputs": [],
      "stateMutability": "payable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_tokenId",
          "type": "uint256"
        }
      ],
      "name": "cancelListing",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_tokenId",
          "type": "uint256"
        }
      ],
      "name": "claimWinnings",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "string",
          "name": "_description",
          "type": "string"
        },
        {
          "internalType": "string[]",
          "name": "_options",
          "type": "string[]"
        },
        {
          "internalType": "uint256",
          "name": "_endTime",
          "type": "uint256"
        }
      ],
      "name": "createActivity",
      "outputs": [],
      "stateMutability": "payable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_activityId",
          "type": "uint256"
        }
      ],
      "name": "getActivity",
      "outputs": [
        {
          "components": [
            {
              "internalType": "uint256",
              "name": "id",
              "type": "uint256"
            },
            {
              "internalType": "string",
              "name": "description",
              "type": "string"
            },
            {
              "internalType": "string[]",
              "name": "options",
              "type": "string[]"
            },
            {
              "internalType": "uint256",
              "name": "endTime",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "totalPool",
              "type": "uint256"
            },
            {
              "internalType": "address payable",
              "name": "notary",
              "type": "address"
            },
            {
              "internalType": "bool",
              "name": "settled",
              "type": "bool"
            },
            {
              "internalType": "uint256",
              "name": "winningOption",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "totalWinningAmount",
              "type": "uint256"
            }
          ],
          "internalType": "struct EasyBet.Activity",
          "name": "",
          "type": "tuple"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "tokenId",
          "type": "uint256"
        }
      ],
      "name": "getApproved",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_tokenId",
          "type": "uint256"
        }
      ],
      "name": "getListing",
      "outputs": [
        {
          "components": [
            {
              "internalType": "address",
              "name": "seller",
              "type": "address"
            },
            {
              "internalType": "uint256",
              "name": "price",
              "type": "uint256"
            },
            {
              "internalType": "bool",
              "name": "active",
              "type": "bool"
            }
          ],
          "internalType": "struct EasyBet.Listing",
          "name": "",
          "type": "tuple"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_tokenId",
          "type": "uint256"
        }
      ],
      "name": "getTicketInfo",
      "outputs": [
        {
          "components": [
            {
              "internalType": "uint256",
              "name": "activityId",
              "type": "uint256"
            },
            {
              "internalType": "address",
              "name": "player",
              "type": "address"
            },
            {
              "internalType": "uint256",
              "name": "optionIndex",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "amount",
              "type": "uint256"
            },
            {
              "internalType": "bool",
              "name": "claimed",
              "type": "bool"
            }
          ],
          "internalType": "struct EasyBet.BetInfo",
          "name": "",
          "type": "tuple"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "owner",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "operator",
          "type": "address"
        }
      ],
      "name": "isApprovedForAll",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_tokenId",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "_price",
          "type": "uint256"
        }
      ],
      "name": "listTicket",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "name": "listings",
      "outputs": [
        {
          "internalType": "address",
          "name": "seller",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "price",
          "type": "uint256"
        },
        {
          "internalType": "bool",
          "name": "active",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "name",
      "outputs": [
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "owner",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "tokenId",
          "type": "uint256"
        }
      ],
      "name": "ownerOf",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "renounceOwnership",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "from",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "to",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "tokenId",
          "type": "uint256"
        }
      ],
      "name": "safeTransferFrom",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "from",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "to",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "tokenId",
          "type": "uint256"
        },
        {
          "internalType": "bytes",
          "name": "data",
          "type": "bytes"
        }
      ],
      "name": "safeTransferFrom",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "operator",
          "type": "address"
        },
        {
          "internalType": "bool",
          "name": "approved",
          "type": "bool"
        }
      ],
      "name": "setApprovalForAll",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_activityId",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "_winningOptionIndex",
          "type": "uint256"
        }
      ],
      "name": "settleActivity",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "bytes4",
          "name": "interfaceId",
          "type": "bytes4"
        }
      ],
      "name": "supportsInterface",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "symbol",
      "outputs": [
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "name": "ticketInfo",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "activityId",
          "type": "uint256"
        },
        {
          "internalType": "address",
          "name": "player",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "optionIndex",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "amount",
          "type": "uint256"
        },
        {
          "internalType": "bool",
          "name": "claimed",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "tokenId",
          "type": "uint256"
        }
      ],
      "name": "tokenURI",
      "outputs": [
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "totalActivities",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "totalTickets",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "from",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "to",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "tokenId",
          "type": "uint256"
        }
      ],
      "name": "transferFrom",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "newOwner",
          "type": "address"
        }
      ],
      "name": "transferOwnership",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    }
  ];

// --- Contract Address ---
// Replace with your deployed contract address
const contractAddress = "0xbE7959E33B2eb78584F440CE7C966BE84301893a"; // Example: "0x5FbDB2315678afecb367f032d93F642f64180aa3" for local Hardhat node


// --- Helper Functions ---
const formatEther = (wei: any) => ethers.utils.formatEther(wei);
const parseEther = (ether: any) => ethers.utils.parseEther(ether);
const formatTimestamp = (timestamp: any) => {
    if (!timestamp || timestamp.isZero()) return "N/A";
    try {
        return new Date(timestamp.toNumber() * 1000).toLocaleString();
    } catch (e) {
        // Handle potential BigNumber overflow for very large timestamps
        return timestamp.toString();
    }
}

// --- Main App Component ---
function App() {
    const [provider, setProvider] = useState<any>(null);
    const [signer, setSigner] = useState<any>(null);
    const [contract, setContract] = useState<any>(null);
    const [account, setAccount] = useState<string | null>(null);
    const [isNotary, setIsNotary] = useState<boolean>(false);
    const [activities, setActivities] = useState<any[]>([]);
    const [myTickets, setMyTickets] = useState<any[]>([]);
    const [listedTickets, setListedTickets] = useState<any[]>([]);
    const [orderBooks, setOrderBooks] = useState<any[]>([]); // <-- 新增：聚合后的订单簿
    const [loadingMessage, setLoadingMessage] = useState<string>('');
    const [errorMessage, setErrorMessage] = useState<string>('');
    const [successMessage, setSuccessMessage] = useState<string>('');
    const [contractBalance, setContractBalance] = useState<any>(ethers.BigNumber.from(0));

    // --- Form States ---
    const [newActivityDesc, setNewActivityDesc] = useState<string>('');
    const [newActivityOptions, setNewActivityOptions] = useState<string>(''); // Comma-separated
    const [newActivityEndTime, setNewActivityEndTime] = useState<string>(''); // Date string
    const [newActivityPool, setNewActivityPool] = useState<string>(''); // ETH
    const [buyTicketActivityId, setBuyTicketActivityId] = useState<string>('');
    const [buyTicketOptionIndex, setBuyTicketOptionIndex] = useState<string>('');
    const [buyTicketAmount, setBuyTicketAmount] = useState<string>(''); // ETH
    const [listTicketId, setListTicketId] = useState<string>('');
    const [listTicketPrice, setListTicketPrice] = useState<string>(''); // ETH
    const [settleActivityId, setSettleActivityId] = useState<string>('');
    const [settleWinningOption, setSettleWinningOption] = useState<string>('');
    
    // --- Effects ---

    // Connect Wallet
    const connectWallet = useCallback(async () => {
        setLoadingMessage('Connecting Wallet...');
        setErrorMessage('');
        setSuccessMessage('');
         if (typeof ethers === 'undefined' || !ethers) {
            setErrorMessage('Ethers library is not loaded. Please wait or refresh.');
            setLoadingMessage('');
            console.error('Ethers library not found on window object.');
            return;
        }

        if ((window as any).ethereum) {
            try {
                const web3Provider = new ethers.providers.Web3Provider((window as any).ethereum);
                await web3Provider.send("eth_requestAccounts", []);
                const web3Signer = web3Provider.getSigner();
                const userAccount = await web3Signer.getAddress();
                        // DEBUG: 检查网络 & 合约代码
        const network = await web3Provider.getNetwork();
        console.log('Connected network:', network);

        // 将 provider 暴露到 window 以便在控制台调试：在控制台运行 window.__appProvider.getCode(contractAddress)
        (window as any).__appProvider = web3Provider;

        const code = await web3Provider.getCode(contractAddress);
        console.log('Contract code at address:', contractAddress, code);
        if (!code || code === '0x') {
            setErrorMessage(`No contract found at ${contractAddress} on network ${network.name || network.chainId}. Please switch MetaMask to the correct network or update contractAddress.`);
            setLoadingMessage('');
            return;
        }

        const easyBetContract = new ethers.Contract(contractAddress, contractABI, web3Signer);


                setProvider(web3Provider);
                setSigner(web3Signer);
                setContract(easyBetContract);
                setAccount(userAccount);
                setLoadingMessage('');
                setSuccessMessage('Wallet Connected');

                // Check if connected account is the notary (owner)
                const owner = await easyBetContract.owner();
                setIsNotary(userAccount.toLowerCase() === owner.toLowerCase());

            } catch (error: any) {
                console.error("Error connecting wallet:", error);
                setErrorMessage(`Error connecting wallet: ${error.message || error}`);
                setLoadingMessage('');
            }
        } else {
            setErrorMessage("MetaMask not detected. Please install MetaMask.");
            setLoadingMessage('');
        }
    }, []);

    // Fetch Data from Contract
    const fetchData = useCallback(async () => {
        if (!contract || !account || !provider) return;
        setLoadingMessage('Fetching contract data...');
        setErrorMessage('');
        try {
        // --- Activities ---
        const totalActs = await contract.totalActivities();
        const fetchedActivities: any[] = [];
        const actPromises: Promise<any>[] = [];
        for (let i = 1; i <= totalActs.toNumber(); i++) {
            actPromises.push(contract.getActivity(i));
        }
        const actResults = await Promise.allSettled(actPromises);
        actResults.forEach((result) => {
            if (result.status === 'fulfilled') {
                const actData = result.value;
                fetchedActivities.push({
                    id: actData.id, // BigNumber
                    description: actData.description,
                    options: Array.isArray(actData.options) ? actData.options : [],
                    endTime: actData.endTime,
                    totalPool: actData.totalPool, // BigNumber
                    notary: actData.notary,
                    settled: actData.settled,
                    winningOption: actData.winningOption, // BigNumber
                    totalWinningAmount: actData.totalWinningAmount // BigNumber
                });
            }
        });
        fetchedActivities.sort((a, b) => Number(b.id.toString()) - Number(a.id.toString()));
        setActivities(fetchedActivities);

        // --- Tickets ---
        const totalTickets = await contract.totalTickets();
        const total = totalTickets.toNumber();
        const ticketInfoPromises: Promise<any>[] = [];
        for (let id = 1; id <= total; id++) {
            ticketInfoPromises.push(
                Promise.all([
                    Promise.resolve(id),
                    contract.getTicketInfo(id).catch(() => null),
                    contract.getListing(id).catch(() => null)
                ]).catch(() => null)
            );
        }
        const ticketResults = await Promise.allSettled(ticketInfoPromises);

        const myTicketsArr: any[] = [];
        const listedTicketsArr: any[] = [];

        for (let i = 0; i < ticketResults.length; i++) {
            const res = ticketResults[i];
            if (res.status !== 'fulfilled' || !res.value) continue;
            const [tokenIdRaw, info, listing] = res.value;
            if (!info) continue;
            const tokenId = ethers.BigNumber.from(tokenIdRaw);
            const activityId = ethers.BigNumber.from(info.activityId);
            const optionIndex = ethers.BigNumber.from(info.optionIndex);
            const amount = ethers.BigNumber.from(info.amount);
            const ownerAddr = (info.player || info.owner || '').toLowerCase();

            // find activity for payout calculation
            const activity = fetchedActivities.find(a => a.id.eq(activityId));
            let potentialPayout = ethers.BigNumber.from(0);
            if (activity && activity.settled && activity.totalWinningAmount && !activity.totalWinningAmount.isZero()) {
                // only winners (same option) can claim; calculate proportional share:
                if (optionIndex.eq(activity.winningOption)) {
                    potentialPayout = amount.mul(activity.totalPool).div(activity.totalWinningAmount);
                }
            }

            const ticketObj = {
                tokenId,
                activityId,
                optionIndex,
                amount,
                claimed: info.claimed,
                listing: (listing && listing.active) ? { price: listing.price, seller: listing.seller } : null,
                potentialPayout // BigNumber
            };

            if (ownerAddr === account.toLowerCase()) myTicketsArr.push(ticketObj);
            if (listing && listing.active && listing.seller && listing.seller.toLowerCase() !== account.toLowerCase()) {
                listedTicketsArr.push({
                    ...ticketObj,
                    price: listing.price,
                    seller: listing.seller
                });
            }
        }

        myTicketsArr.sort((a, b) => Number(b.tokenId.toString()) - Number(a.tokenId.toString()));
        listedTicketsArr.sort((a, b) => Number(b.tokenId.toString()) - Number(a.tokenId.toString()));

        setMyTickets(myTicketsArr);
        setListedTickets(listedTicketsArr);

        // --- Contract balance (for display) ---
        try {
            const bal = await provider.getBalance(contractAddress);
            setContractBalance(bal);
        } catch (balErr) {
            console.warn('Failed to read contract balance:', balErr);
        }

        setLoadingMessage('');
    } catch (error: any) {
        console.error("Error fetching data:", error);
        setErrorMessage(`Error fetching data: ${error?.data?.message || error?.message || error}`);
        setLoadingMessage('');
    }
}, [contract, account, provider]);

    // 自动连接钱包（如果地址已设置）
    useEffect(() => {
        if (contractAddress) {
             connectWallet(); // Attempt to connect automatically if address is set

             // Listen for account changes
             if ((window as any).ethereum) {
                 (window as any).ethereum.on('accountsChanged', (accounts: string[]) => {
                     console.log('Account changed:', accounts);
                     // Reconnect or update account state
                      connectWallet();
                 });
                  (window as any).ethereum.on('chainChanged', () => {
                     // Reload or prompt user to switch network
                     window.location.reload();
                 });
             }
        }
         // Cleanup listeners on unmount
         return () => {
             if ((window as any).ethereum) {
                 (window as any).ethereum.removeListener('accountsChanged', connectWallet);
                  (window as any).ethereum.removeListener('chainChanged', () => window.location.reload());
             }
         };

    }, [connectWallet]); // Run only once on mount

    useEffect(() => {
        fetchData();
    }, [fetchData]); // Refetch when contract or account changes


    // 将 listedTickets 聚合为 orderBooks（按 activity -> option -> price levels）
    useEffect(() => {
        if (!listedTickets || listedTickets.length === 0) {
            setOrderBooks([]);
            return;
        }
        const grouped: any = {}; // key = `${activityId}-${optionIndex}`
        listedTickets.forEach((lt: any) => {
            try {
                const activityId = lt.activityId.toString();
                const optionIndex = typeof lt.optionIndex === 'number' ? lt.optionIndex : (lt.optionIndex.toNumber ? lt.optionIndex.toNumber() : parseInt(String(lt.optionIndex)));
                const key = `${activityId}-${optionIndex}`;
                const priceKey = lt.price.toString();

                if (!grouped[key]) {
                    const activity = activities.find(a => String(a.id) === String(activityId));
                    grouped[key] = {
                        activityId,
                        description: activity ? activity.description : '',
                        optionIndex,
                        optionText: activity && Array.isArray(activity.options) ? (activity.options[optionIndex] || '?') : '?',
                        sellLevels: {}
                    };
                }

                if (!grouped[key].sellLevels[priceKey]) {
                    grouped[key].sellLevels[priceKey] = {
                        price: lt.price,
                        tokenIds: [],
                        totalAmountBet: ethers.BigNumber.from(0),
                        sampleSeller: lt.seller // keep one seller to display
                    };
                }

                grouped[key].sellLevels[priceKey].tokenIds.push(lt.tokenId);
                grouped[key].sellLevels[priceKey].totalAmountBet = grouped[key].sellLevels[priceKey].totalAmountBet.add(lt.amountBet || ethers.BigNumber.from(0));
            } catch (e) {
                console.warn('OrderBook grouping error:', e, lt);
            }
        });

        const books = Object.values(grouped).map((g: any) => {
            const levels = Object.values(g.sellLevels)
                .map((l: any) => ({ price: l.price, tokenIds: l.tokenIds, totalAmountBet: l.totalAmountBet, sampleSeller: l.sampleSeller }))
                .sort((a: any, b: any) => {
                    try { return a.price.sub(b.price).toNumber(); } catch { return 0; }
                });
            return {
                activityId: g.activityId,
                description: g.description,
                optionIndex: g.optionIndex,
                optionText: g.optionText,
                sellOrders: levels
            };
        });

        setOrderBooks(books);
    }, [listedTickets, activities]);

    // --- Transaction Handlers ---

    const handleTx = async (txPromise: Promise<any>, successMsg: string) => {
        setLoadingMessage('Processing transaction...');
        setErrorMessage('');
        setSuccessMessage('');
        try {
            const tx = await txPromise;
            setLoadingMessage('Waiting for confirmation...');
            await tx.wait();
            setSuccessMessage(successMsg);
            fetchData(); // Refresh data after successful transaction
        } catch (error: any) {
            console.error("Transaction failed:", error);
            // Attempt to parse Solidity revert reason
             let reason = error?.data?.message || error?.reason || error?.message || 'Transaction failed';
             if (error?.data?.message && error.data.message.includes('reverted with reason string')) {
                // Ethers v5 often includes the reason string here
                 const match = error.data.message.match(/'([^']*)'/);
                 if (match) reason = match[1];
            } else if (error?.reason) {
                reason = error.reason;
             } else if (error?.error?.message) { // Handle errors from MetaMask reject or contract logic errors
                  reason = error.error.message;
             }
             // Remove potential prefixes added by providers
             reason = reason.replace('execution reverted: ', '').replace('Error: ', '');

             setErrorMessage(`Transaction failed: ${reason}`);
        } finally {
            setLoadingMessage('');
        }
    };

    const handleCreateActivity = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!contract || !isNotary || !provider || !signer || !account) return;
        try {
            const optionsArray = newActivityOptions.split(',').map(opt => opt.trim()).filter(opt => opt);
            if (optionsArray.length < 2) {
                setErrorMessage("Please provide at least two comma-separated options.");
                return;
            }
            const endTimeDate = new Date(newActivityEndTime);
            if (isNaN(endTimeDate.getTime())) {
                setErrorMessage("Invalid end date/time format.");
                return;
            }
            const endTimeTimestamp = Math.floor(endTimeDate.getTime() / 1000);
            const poolAmount = parseEther(newActivityPool || '0');

            // Quick client-side checks
            const chainBlock = await provider.getBlock('latest');
            if (endTimeTimestamp <= chainBlock.timestamp) {
                setErrorMessage("End time must be in the future (greater than current block timestamp).");
                return;
            }
            // If contract requires non-zero pool, enforce here (optional)
            // if (poolAmount.isZero()) { setErrorMessage("Initial pool must be greater than 0."); return; }

            // Build txn object for simulation
            const txData = contract.interface.encodeFunctionData("createActivity", [newActivityDesc, optionsArray, endTimeTimestamp]);
            const callTx = {
                to: contractAddress,
                from: account,
                data: txData,
                value: poolAmount.toHexString()
            };

            // Helper to decode revert reason (supports Error(string))
            const decodeRevertReason = (data: string) => {
                try {
                    if (!data || data === '0x') return null;
                    // standard Error(string) selector 0x08c379a0
                    if (data.startsWith('0x08c379a0')) {
                        const reasonHex = '0x' + data.slice(10);
                        const reason = ethers.utils.defaultAbiCoder.decode(['string'], reasonHex)[0];
                        return reason;
                    }
                    // fallback: try utf8 decode
                    try {
                        return ethers.utils.toUtf8String('0x' + data.replace(/^0x/, '').slice(8)); // best-effort
                    } catch (e) {
                        return `Reverted with data: ${data}`;
                    }
                } catch (e) {
                    return `Failed to decode revert data: ${String(e)}`;
                }
            };

            // 1) Simulate via provider.call to surface revert data (avoid MetaMask generic -32603)
            try {
                await provider.call(callTx); // If this throws, capture below
            } catch (simErr: any) {
                console.error("provider.call simulation error:", simErr);
                // Attempt to extract hex revert data from different shapes
                const hex =
                    simErr?.error?.data ||
                    simErr?.data ||
                    (simErr?.body && (() => { try { return JSON.parse(simErr.body).error?.data } catch { return null } })()) ||
                    simErr?.error?.originalError?.data ||
                    null;
                const reason = decodeRevertReason(typeof hex === 'string' ? hex : (simErr?.error?.message || simErr?.message || String(simErr)));
                setErrorMessage(`Simulation failed: ${reason || 'reverted (no reason returned)'} (check node logs)`);
                return;
            }

            // 2) Estimate gas
            let gasEstimate;
            try {
                gasEstimate = await contract.estimateGas.createActivity(newActivityDesc, optionsArray, endTimeTimestamp, { value: poolAmount });
            } catch (gasErr: any) {
                console.error("Gas estimate failed:", gasErr);
                // try to extract reason similarly
                const hex = gasErr?.error?.data || gasErr?.data || null;
                const reason = decodeRevertReason(hex);
                setErrorMessage(`Estimate gas failed: ${reason || gasErr?.message || String(gasErr)}`);
                return;
            }

            // 3) Balance check (value + gas)
            try {
                const bal = await provider.getBalance(account);
                const gasPrice = await provider.getGasPrice();
                const gasCost = gasEstimate.mul(gasPrice);
                if (bal.lt(poolAmount.add(gasCost))) {
                    setErrorMessage("Insufficient balance to cover pool amount + estimated gas. Fund the account and retry.");
                    return;
                }
            } catch (balErr) {
                console.warn("Balance/gasPrice check failed:", balErr);
            }

            // 4) Send tx via signer with gas buffer
            const gasLimit = gasEstimate.mul(120).div(100); // +20%
            await handleTx(
                contract.connect(signer).createActivity(newActivityDesc, optionsArray, endTimeTimestamp, { value: poolAmount, gasLimit }),
                'Activity created successfully!'
            );

            // Clear form
            setNewActivityDesc('');
            setNewActivityOptions('');
            setNewActivityEndTime('');
            setNewActivityPool('');
        } catch (error: any) {
            console.error("Create activity error (unexpected):", error);
            const msg = error?.message ?? String(error);
            setErrorMessage(`Failed to create activity: ${msg}`);
        }
    };

    const handleBuyTicket = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!contract) return;
         try {
             const amountWei = parseEther(buyTicketAmount || '0');
             if (amountWei.isZero()) {
                  setErrorMessage("Bet amount must be greater than zero.");
                  return;
             }
             const activityIdNum = parseInt(buyTicketActivityId);
             const optionIndexNum = parseInt(buyTicketOptionIndex);

             if (isNaN(activityIdNum) || isNaN(optionIndexNum)) {
                 setErrorMessage("Invalid Activity ID or Option Index.");
                 return;
             }


             await handleTx(
                 contract.buyTicket(activityIdNum, optionIndexNum, { value: amountWei }),
                 `Ticket purchased successfully for activity ${activityIdNum}!`
            );
             // Clear form
             setBuyTicketActivityId('');
             setBuyTicketOptionIndex('');
             setBuyTicketAmount('');
        } catch (error) {
             // Error handled by handleTx
        }
    };

     const handleApproveAndListTicket = async (e: React.FormEvent) => {
         e.preventDefault();
         if (!contract) return;
         try {
             const tokenIdNum = parseInt(listTicketId);
             const priceWei = parseEther(listTicketPrice || '0');
             if (isNaN(tokenIdNum) || priceWei.isZero()) {
                 setErrorMessage("Invalid Token ID or Price.");
                 return;
             }

             // 1. Approve the contract to manage this specific NFT
             setLoadingMessage(`Approving ticket ${tokenIdNum}...`);
             setErrorMessage('');
             setSuccessMessage('');
             const approveTx = await contract.approve(contractAddress, tokenIdNum);
             setLoadingMessage('Waiting for approval confirmation...');
             await approveTx.wait();
             setSuccessMessage(`Ticket ${tokenIdNum} approved.`);

             // 2. List the ticket
             await handleTx(
                 contract.listTicket(tokenIdNum, priceWei),
                 `Ticket ${tokenIdNum} listed successfully for ${listTicketPrice} ETH!`
             );
              // Clear form
              setListTicketId('');
              setListTicketPrice('');
         } catch (error: any) {
              // Error handled by handleTx or during approval
              if (!errorMessage) { // Prevent overwriting specific tx failure message
                  setErrorMessage(`Failed to approve or list ticket: ${error?.data?.message || error?.reason || error?.message || error}`);
                  setLoadingMessage('');
              }
         }
     };

     const handleCancelListing = async (tokenId: any) => {
         if (!contract) return;
         await handleTx(
             contract.cancelListing(tokenId),
             `Listing for ticket ${tokenId} cancelled.`
         );
     };

     const handleBuyListedTicket = async (tokenId: any, price: any) => {
         if (!contract) return;
         try {
             // Normalize inputs immediately to avoid later closure / reference bugs
             const tokenIdStr = tokenId && tokenId.toString ? tokenId.toString() : String(tokenId);
             const priceStr = price && price.toString ? price.toString() : String(price);
             const tokenIdBN = ethers.BigNumber.from(tokenIdStr);
             const priceBN = ethers.BigNumber.from(priceStr);

             console.log(`Buying listed token -> tokenId: ${tokenIdBN.toString()}, price: ${priceBN.toString()}`);

             // Use handleTx but ensure we pass a fresh tx Promise
             await handleTx(
                 contract.buyListedTicket(tokenIdBN, { value: priceBN }),
                 `Ticket ${tokenIdBN.toString()} purchased successfully!`
             );
         } catch (err: any) {
             console.error("handleBuyListedTicket error:", err);
             // Let handleTx set friendly message when possible, otherwise show fallback
             if (!errorMessage) setErrorMessage(err?.message || String(err));
         }
     };

    const handleSettleActivity = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!contract || !isNotary) return;
        try {
             const activityIdNum = parseInt(settleActivityId);
             const winningOptionNum = parseInt(settleWinningOption);
             if (isNaN(activityIdNum) || isNaN(winningOptionNum)) {
                 setErrorMessage("Invalid Activity ID or Winning Option Index.");
                 return;
             }
            await handleTx(
                contract.settleActivity(activityIdNum, winningOptionNum),
                `Activity ${activityIdNum} settled successfully!`
            );
             // Clear form
             setSettleActivityId('');
             setSettleWinningOption('');
        } catch (error) {
            // Error handled by handleTx
        }
    };

    const handleClaimWinnings = async (tokenId: any) => {
        if (!contract) return;
        await handleTx(
            contract.claimWinnings(tokenId),
            `Winnings for ticket ${tokenId} claimed!`
        );
    };
// 新增：从订单簿购买该价位金额最高的一张票（复用已有 handleBuyListedTicket）
// ...existing code...
const handleBuyFromOrderBook = async (activityId: string, optionIndex: number, priceLevel: any) => {
    if (!priceLevel || !priceLevel.tokenIds || priceLevel.tokenIds.length === 0) {
        setErrorMessage("No tickets available at this price.");
        return;
    }

    // Snapshot tokenIds for safety
    const tokenIds = (priceLevel.tokenIds || []).map((t: any) => (t && t.toString) ? t.toString() : String(t));

    // Find listedTickets entries for these tokenIds and pick the one with MAX amount
    let chosenTokenIdStr: string | null = null;
    let maxAmount = ethers.BigNumber.from(0);

    for (const tidStr of tokenIds) {
        const found = listedTickets.find((lt: any) => {
            const ltId = (lt.tokenId && lt.tokenId.toString) ? lt.tokenId.toString() : String(lt.tokenId);
            return ltId === tidStr;
        });
        const amt = found ? (found.amount ?? found.amountBet ?? ethers.BigNumber.from(0)) : ethers.BigNumber.from(0);
        const amtBN = ethers.BigNumber.isBigNumber(amt) ? amt : ethers.BigNumber.from(amt);
        if (amtBN.gt(maxAmount)) {
            maxAmount = amtBN;
            chosenTokenIdStr = tidStr;
        }
    }

    // Fallback to first token if none matched
    if (!chosenTokenIdStr) {
        chosenTokenIdStr = tokenIds[0];
    }

    const priceStr = priceLevel.price && priceLevel.price.toString ? priceLevel.price.toString() : String(priceLevel.price);

    console.log(`handleBuyFromOrderBook -> activity:${activityId} option:${optionIndex} chosenToken:${chosenTokenIdStr} price:${priceStr} (maxAmount=${maxAmount.toString()})`);

    try {
        const tokenIdBN = ethers.BigNumber.from(chosenTokenIdStr);
        const priceBN = ethers.BigNumber.from(priceStr);
        await handleBuyListedTicket(tokenIdBN, priceBN);
    } catch (e: any) {
        console.error("handleBuyFromOrderBook buy error:", e);
        if (!errorMessage) setErrorMessage(e?.message || String(e));
    }
};
// ...existing code...
     // Simple faucet for local testing (adjust amount and recipient as needed)
     const getTestEth = async () => {
         if (!provider || !account) return;
         setLoadingMessage('Requesting Test ETH...');
         setErrorMessage('');
         try {
              // On a local Hardhat node, the default deployer (usually accounts[0]) has ETH.
              // We'll try sending from it. This requires the deployer's signer.
              // NOTE: This will ONLY work if your MetaMask is connected to Hardhat node AND
              // you have imported the private key for the deployer account (usually accounts[0]).
              // Or, configure Hardhat to use MetaMask accounts directly.
              // A more robust local faucet involves a separate contract or backend service.

              // Let's assume the connected signer *might* be the deployer or has funds
               const localSigner = provider.getSigner(0); // Attempt to get the default Hardhat account signer
               const amountToSend = parseEther("1.0"); // Send 1 ETH

               const tx = await localSigner.sendTransaction({
                   to: account,
                   value: amountToSend
               });
               await tx.wait();
              setSuccessMessage('1 Test ETH sent (check balance)!');

         } catch (err: any) {
              console.error("Faucet error:", err);
              setErrorMessage("Failed to get test ETH. Ensure you're on a local node and the faucet account has funds/is available.");
         } finally {
             setLoadingMessage('');
         }
     };


    // Listen to contract events to refresh UI
    useEffect(() => {
        if (!contract) return;
        const onSettled = (activityId: any, winningOption: any) => {
            console.log('ActivitySettled', activityId.toString(), winningOption.toString());
            setSuccessMessage(`Activity ${activityId.toString()} settled (winner: ${winningOption.toString()})`);
            fetchData();
        };
        const onWinningsClaimed = (tokenId: any, player: any, amount: any) => {
            console.log('WinningsClaimed', tokenId.toString(), player, amount.toString());
            setSuccessMessage(`Winnings claimed for ticket ${tokenId.toString()}`);
            fetchData();
        };

        contract.on('ActivitySettled', onSettled);
        contract.on('WinningsClaimed', onWinningsClaimed);

        return () => {
            contract.removeListener('ActivitySettled', onSettled);
            contract.removeListener('WinningsClaimed', onWinningsClaimed);
        };
    }, [contract, fetchData]);

    // --- Render ---

    return (
        <div className="min-h-screen bg-gray-900 text-gray-200 font-sans p-4 md:p-8">
            <header className="mb-8 flex justify-between items-center">
                <h1 className="text-3xl font-bold text-teal-400">🏆 EasyBet DApp</h1>
                {account ? (
                    <div className="text-sm">
                         <p>Connected: <span className="font-mono bg-gray-700 px-2 py-1 rounded">{account.substring(0, 6)}...{account.substring(account.length - 4)}</span></p>
                         {isNotary && <p className="text-yellow-400 font-bold">(Notary)</p>}
                    </div>
                ) : (
                    <button
                        onClick={connectWallet}
                        className="bg-teal-500 hover:bg-teal-600 text-white font-bold py-2 px-4 rounded transition duration-200"
                    >
                        Connect Wallet
                    </button>
                )}
            </header>

            {/* Notifications */}
            {loadingMessage && <div className="mb-4 p-3 bg-blue-600 text-white rounded animate-pulse">{loadingMessage}</div>}
            {errorMessage && <div className="mb-4 p-3 bg-red-600 text-white rounded">{errorMessage} <button onClick={() => setErrorMessage('')} className="float-right font-bold">X</button></div>}
            {successMessage && <div className="mb-4 p-3 bg-green-600 text-white rounded">{successMessage} <button onClick={() => setSuccessMessage('')} className="float-right font-bold">X</button></div>}

             {/* Faucet for Local Testing */}
             {account  && ( // Only show if connected and using default local address
                 <div className="mb-6 p-4 bg-gray-800 rounded">
                      <button
                           onClick={getTestEth}
                           className="bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-2 px-4 rounded transition duration-200"
                      >
                           Get 1 Local Test ETH
                      </button>
                      <p className="text-xs mt-1 text-gray-400">For local Hardhat node testing only.</p>
                 </div>
             )}


            {/* Main Content Area - Requires Wallet Connection */}
            {contract && account ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

                     {/* Column 1: Activities & Buying */}
                     <div className="bg-gray-800 p-4 rounded shadow-lg space-y-4">
                         <h2 className="text-xl font-semibold text-teal-300 border-b border-gray-700 pb-2">🎰 Available Activities</h2>
                         <div className="max-h-96 overflow-y-auto space-y-3 pr-2">
                             {activities.length > 0 ? activities.map(act => (
                                 <div key={act.id.toString()} className="p-3 bg-gray-700 rounded text-sm">
                                     <p><strong>ID:</strong> {act.id.toString()}</p>
                                     <p><strong>Desc:</strong> {act.description}</p>
                                     <p><strong>Options:</strong></p>
                                     <ul className="list-disc list-inside ml-4">
                                         {act.options.map((opt: string, index: number) => <li key={index}>{index}: {opt}</li>)}
                                     </ul>
                                     <p><strong>Ends:</strong> {formatTimestamp(act.endTime)}</p>
                                     <p><strong>Pool:</strong> {formatEther(act.totalPool)} ETH</p>
                                     <p className={`font-bold ${act.settled ? 'text-red-400' : 'text-green-400'}`}>
                                          {act.settled ? `Settled (Winner: ${act.winningOption ?? 'N/A'})` : 'Active'}
                                      </p>
                                     {/* *** 错误修复 ***
                                        将 Solidity 的 'block.timestamp' 替换为 JavaScript 的 'Date.now()' 
                                     */}
                                     {(Date.now() / 1000) >= act.endTime && !act.settled && <p className="text-yellow-400">Betting Closed</p>}
                                 </div>
                             )) : <p>No activities found.</p>}
                         </div>

                         <h3 className="text-lg font-semibold text-teal-300 pt-4 border-t border-gray-700">🛒 Buy Ticket</h3>
                         <form onSubmit={handleBuyTicket} className="space-y-2">
                             <input type="number" placeholder="Activity ID" value={buyTicketActivityId} onChange={e => setBuyTicketActivityId(e.target.value)} required className="w-full p-2 bg-gray-700 rounded border border-gray-600 focus:outline-none focus:border-teal-500" />
                             <input type="number" placeholder="Option Index" value={buyTicketOptionIndex} onChange={e => setBuyTicketOptionIndex(e.target.value)} required className="w-full p-2 bg-gray-700 rounded border border-gray-600 focus:outline-none focus:border-teal-500" />
                             <input type="number" step="any" placeholder="Amount (ETH)" value={buyTicketAmount} onChange={e => setBuyTicketAmount(e.target.value)} required className="w-full p-2 bg-gray-700 rounded border border-gray-600 focus:outline-none focus:border-teal-500" />
                             <button type="submit" className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition duration-200">
                                 Buy Ticket
                             </button>
                         </form>
                     </div>

                     {/* Column 2: My Tickets & Listings */}
                     <div className="bg-gray-800 p-4 rounded shadow-lg space-y-4">
                         <h2 className="text-xl font-semibold text-teal-300 border-b border-gray-700 pb-2">🎟️ My Tickets (NFTs)</h2>
                         <div className="max-h-96 overflow-y-auto space-y-3 pr-2">
                             {myTickets.length > 0 ? myTickets.map(ticket => {
    const activity = activities.find(a => a.id.eq(ticket.activityId));
    // 使用 BigNumber.eq 或字符串比较来判断是否为中奖选项
    const winningOptionMatches = !!activity && activity.winningOption != null
        ? (ethers.BigNumber.isBigNumber(activity.winningOption)
            ? activity.winningOption.eq(ticket.optionIndex)
            : String(activity.winningOption) === String(ticket.optionIndex))
        : false;

    const canClaim = activity?.settled && winningOptionMatches && !ticket.claimed;
    const isListed = ticket.listing !== null;
    return (
        <div key={ticket.tokenId.toString()} className={`p-3 rounded text-sm ${isListed ? 'bg-yellow-800 border border-yellow-600' : 'bg-gray-700'}`}>
            <p><strong>Token ID:</strong> {ticket.tokenId.toString()}</p>
            <p><strong>Activity ID:</strong> {ticket.activityId.toString()}</p>
            <p><strong>Option:</strong> {ticket.optionIndex.toString()} ({activity?.options[ticket.optionIndex] || '?'})</p>
            <p><strong>Amount Bet:</strong> {formatEther(ticket.amount)} ETH</p>

            {activity?.settled && (
                <p className={`font-bold ${winningOptionMatches ? 'text-green-400' : 'text-red-400'}`}>
                    {winningOptionMatches ? 'WINNER' : 'Lost'}
                    {ticket.claimed ? ' (Claimed)' : ''}
                </p>
            )}

            {/* 显示可提取金额（如果已计算） */}
            {ticket.potentialPayout && !ticket.potentialPayout.isZero() && (
                <p className="text-sm text-teal-200">Potential payout: {formatEther(ticket.potentialPayout)} ETH</p>
            )}

            {isListed && (
                <div className="mt-2 pt-2 border-t border-yellow-700">
                    <p className="text-yellow-300 font-semibold">Listed for: {formatEther(ticket.listing.price)} ETH</p>
                    <button
                        onClick={() => handleCancelListing(ticket.tokenId)}
                        className="mt-1 text-xs bg-red-600 hover:bg-red-700 text-white py-1 px-2 rounded"
                    >
                        Cancel Listing
                    </button>
                </div>
            )}

            {canClaim && (
                <button
                    onClick={() => handleClaimWinnings(ticket.tokenId)}
                    className="mt-2 bg-green-500 hover:bg-green-600 text-white font-bold py-1 px-3 rounded text-sm"
                >
                    Claim Winnings
                </button>
            )}
        </div>
    );
}) : <p>You don't own any tickets.</p>}
                         </div>

                         <h3 className="text-lg font-semibold text-teal-300 pt-4 border-t border-gray-700">🏷️ List Ticket for Sale</h3>
                         <form onSubmit={handleApproveAndListTicket} className="space-y-2">
                             <input type="number" placeholder="Token ID to List" value={listTicketId} onChange={e => setListTicketId(e.target.value)} required className="w-full p-2 bg-gray-700 rounded border border-gray-600 focus:outline-none focus:border-teal-500" />
                             <input type="number" step="any" placeholder="Price (ETH)" value={listTicketPrice} onChange={e => setListTicketPrice(e.target.value)} required className="w-full p-2 bg-gray-700 rounded border border-gray-600 focus:outline-none focus:border-teal-500" />
                             <button type="submit" className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-2 px-4 rounded transition duration-200">
                                 Approve & List Ticket
                             </button>
                         </form>
                     </div>

                     {/* Column 3: Marketplace & Notary Actions */}
                     <div className="bg-gray-800 p-4 rounded shadow-lg space-y-4">
                        <h2 className="text-xl font-semibold text-teal-300 border-b border-gray-700 pb-2">🛒 Order Books (Sell Orders)</h2>
<div className="max-h-96 overflow-y-auto space-y-4 pr-2">
    {orderBooks.length > 0 ? orderBooks.map((book: any) => (
        <div key={`${book.activityId}-${book.optionIndex}`} className="p-3 bg-gray-700 rounded text-sm">
            <div className="flex justify-between items-start">
                <div>
                    <p className="font-semibold">Activity {book.activityId}: {book.description}</p>
                    <p className="text-sm text-teal-300">Option {book.optionIndex}: {book.optionText}</p>
                </div>
                <div className="text-right text-xs text-gray-400">
                    <p>{/* total levels */}{book.sellOrders.length} price level(s)</p>
                    <p className="mt-1">Available: {book.sellOrders.reduce((sum: number, l: any) => sum + l.tokenIds.length, 0)} tickets</p>
                </div>
            </div>

            <div className="mt-3">
                <table className="w-full text-left text-xs table-fixed">
                    <thead>
                        <tr className="border-b border-gray-600">
                            <th className="w-1/3 py-1">Price (ETH)</th>
                            <th className="w-1/3 py-1">Count</th>
                            <th className="w-1/4 py-1">Amount Bet (ETH)</th>
                            <th className="w-1/3 py-1">Action</th>
                        </tr>
                    </thead>
                    <tbody>
{book.sellOrders.map((level: any, idx: number) => {
    // build token detail list by matching listedTickets (safe string compare)
    const tokenDetails = (level.tokenIds || []).map((tid: any) => {
        const tidStr = (tid && tid.toString) ? tid.toString() : String(tid);
        const found = listedTickets.find((lt: any) => {
            const ltId = (lt.tokenId && lt.tokenId.toString) ? lt.tokenId.toString() : String(lt.tokenId);
            return ltId === tidStr;
        });
        const amount = found ? (found.amount ?? found.amountBet ?? ethers.BigNumber.from(0)) : ethers.BigNumber.from(0);
        const seller = found ? found.seller : (level.sampleSeller || 'N/A');
        return { tokenId: tidStr, amount, seller };
    });

    return (
        <React.Fragment key={idx}>
            {/* price level summary row */}
            <tr className="border-b border-gray-700 hover:bg-gray-600">
                <td className="py-1 font-mono truncate">{formatEther(level.price)}</td>
                <td className="py-1 text-center">{(level.tokenIds || []).length}</td>
                <td className="py-1 text-center">{formatEther(level.totalAmountBet || ethers.BigNumber.from(0))}</td>
                <td className="py-1">
                    <div className="flex gap-2">
                        {/* Optional: keep a level-wide buy (will buy first token in this level) */}
                        <button
                            onClick={() => handleBuyFromOrderBook(book.activityId, book.optionIndex, level)}
                            className="bg-purple-600 hover:bg-purple-700 text-white text-xs py-1 px-2 rounded"
                            disabled={loadingMessage.startsWith('Processing')}
                        >
                            Buy (first)
                        </button>
                        <button
                            onClick={() => {
                                const details = tokenDetails.map((d: { tokenId: string; amount: any; seller: string }) => `${d.tokenId} (${formatEther(d.amount)} ETH) by ${d.seller}`);
                                console.log("Tokens at this level:", details);
                                setSuccessMessage(`Tokens: ${details.join(', ')}`);
                                setTimeout(()=>setSuccessMessage(''), 4000);
                            }}
                            className="bg-gray-600 hover:bg-gray-500 text-white text-xs py-1 px-2 rounded"
                        >
                            Show IDs
                        </button>
                    </div>
                </td>
            </tr>

            {/* expanded per-token rows */}
            <tr className="bg-gray-800">
                <td colSpan={4} className="p-2">
                    <div className="space-y-2">
                        {tokenDetails.map((t: any) => (
                            <div key={t.tokenId} className="flex items-center justify-between bg-gray-700 p-2 rounded">
                                <div className="text-sm">
                                    <div><strong>Token ID:</strong> {t.tokenId}</div>
                                    <div className="text-xs text-gray-300">Amount bet: {formatEther(t.amount)} ETH</div>
                                    <div className="text-xs text-gray-400">Seller: {t.seller}</div>
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={async () => {
                                            try {
                                                const tokenIdBN = ethers.BigNumber.from(t.tokenId);
                                                const priceBN = level.price;
                                                console.log(`Buying token ${t.tokenId} for price ${priceBN.toString()}`);
                                                await handleBuyListedTicket(tokenIdBN, priceBN);
                                            } catch (e:any) {
                                                console.error("Buy token error:", e);
                                                if (!errorMessage) setErrorMessage(e?.message || String(e));
                                            }
                                        }}
                                        className="bg-green-600 hover:bg-green-700 text-white text-sm py-1 px-3 rounded"
                                        disabled={loadingMessage.startsWith('Processing')}
                                    >
                                        Buy (Pay ETH)
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </td>
            </tr>
        </React.Fragment>
    );
})}
</tbody>
                </table>
            </div>
        </div>
    )) : <p className="text-sm text-gray-400">No sell orders found.</p>}
</div>

                         {/* Notary Section */}
                         {isNotary && (
                             <>
                                 <h2 className="text-xl font-semibold text-yellow-400 pt-4 border-t border-gray-700">🔑 Notary Actions</h2>

                                 <h3 className="text-lg font-semibold text-yellow-300">➕ Create New Activity</h3>
                                 <form onSubmit={handleCreateActivity} className="space-y-2">
                                     <input type="text" placeholder="Description" value={newActivityDesc} onChange={e => setNewActivityDesc(e.target.value)} required className="w-full p-2 bg-gray-700 rounded border border-gray-600 focus:outline-none focus:border-teal-500" />
                                     <input type="text" placeholder="Options (comma-separated)" value={newActivityOptions} onChange={e => setNewActivityOptions(e.target.value)} required className="w-full p-2 bg-gray-700 rounded border border-gray-600 focus:outline-none focus:border-teal-500" />
                                     <input type="datetime-local" placeholder="End Time" value={newActivityEndTime} onChange={e => setNewActivityEndTime(e.target.value)} required className="w-full p-2 bg-gray-700 rounded border border-gray-600 focus:outline-none focus:border-teal-500 text-gray-400" />
                                      <input type="number" step="any" placeholder="Initial Pool (ETH)" value={newActivityPool} onChange={e => setNewActivityPool(e.target.value)} required className="w-full p-2 bg-gray-700 rounded border border-gray-600 focus:outline-none focus:border-teal-500" />
                                     <button type="submit" className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-2 px-4 rounded transition duration-200">
                                         Create Activity
                                     </button>
                                 </form>

                                 <h3 className="text-lg font-semibold text-yellow-300 pt-4 border-t border-gray-700">🏁 Settle Activity</h3>
                                 <form onSubmit={handleSettleActivity} className="space-y-2">
                                     <input type="number" placeholder="Activity ID to Settle" value={settleActivityId} onChange={e => setSettleActivityId(e.target.value)} required className="w-full p-2 bg-gray-700 rounded border border-gray-600 focus:outline-none focus:border-teal-500" />
                                     <input type="number" placeholder="Winning Option Index" value={settleWinningOption} onChange={e => setSettleWinningOption(e.target.value)} required className="w-full p-2 bg-gray-700 rounded border border-gray-600 focus:outline-none focus:border-teal-500" />
                                     <button type="submit" className="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded transition duration-200">
                                         Settle Activity
                                     </button>
                                 </form>
                             </>
                         )}
                     </div>

                </div>
            ) : (
                <div className="text-center p-8 bg-gray-800 rounded shadow-lg">
                    <p className="text-lg">Please connect your MetaMask wallet to use the DApp.</p>
                     {!contractAddress ?
                         <p className="text-yellow-400 mt-4">Note: Contract address is not set. Please deploy the contract and update `contractAddress` in App.jsx.</p>
                        :
                         <p className="text-gray-400 mt-4">Ensure you are connected to the correct network where the contract is deployed (e.g., Localhost/Ganache).</p>
                    }
                </div>
            )}
        </div>
    );
}

export default App;

