// 1. Your Deployed Addresses
export const SANDBOX_CONTRACT_ADDRESS = "0xE4e422626a10246C8B19Bd0e0eA0535257BBF91c";
export const USDC_TOKEN_ADDRESS = "0xc01efAaF7C5C61bEbFAeb358E1161b537b8bC0e0";

// 2. The ABI for your Sandbox Contract (How to talk to it)
export const SANDBOX_ABI = [
  {
    "inputs": [
      { "internalType": "string", "name": "resourceId", "type": "string" },
      { "internalType": "uint256", "name": "amount", "type": "uint256" }
    ],
    "name": "payForResource",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "anonymous": false,
    "inputs": [
      { "indexed": true, "internalType": "address", "name": "payer", "type": "address" },
      { "indexed": false, "internalType": "string", "name": "resourceId", "type": "string" },
      { "indexed": false, "internalType": "uint256", "name": "amount", "type": "uint256" },
      { "indexed": false, "internalType": "uint256", "name": "timestamp", "type": "uint256" }
    ],
    "name": "PaymentDetected",
    "type": "event"
  }
] as const;

// 3. The ABI for USDC (We only need Approve and Allowance)
export const USDC_ABI = [
  {
    "inputs": [
      { "internalType": "address", "name": "spender", "type": "address" },
      { "internalType": "uint256", "name": "amount", "type": "uint256" }
    ],
    "name": "approve",
    "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "address", "name": "owner", "type": "address" },
      { "internalType": "address", "name": "spender", "type": "address" }
    ],
    "name": "allowance",
    "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
    "stateMutability": "view",
    "type": "function"
  }
] as const;