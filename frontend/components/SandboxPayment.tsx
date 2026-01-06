"use client";

import { useState } from "react";
import { createWalletClient, createPublicClient, custom, http, parseUnits } from "viem";
import { cronosTestnet } from "viem/chains";
import { SANDBOX_CONTRACT_ADDRESS, USDC_TOKEN_ADDRESS, SANDBOX_ABI, USDC_ABI } from "@/lib/contracts";

export default function SandboxPayment() {
  const [status, setStatus] = useState("IDLE"); // IDLE, SIMULATING, PAYING, SUCCESS, ERROR
  const [logs, setLogs] = useState<string[]>([]);

  const addLog = (msg: string) => setLogs((prev) => [...prev, `[${new Date().toLocaleTimeString()}] ${msg}`]);

// Inside components/SandboxPayment.tsx

const handlePayment = async () => {
    const ethereum = (window as any).ethereum;
    if (!ethereum) return alert("Please install MetaMask!");
    
    setStatus("SIMULATING");
    setLogs([]); // Clear old logs on new run
    addLog("🚀 Starting x402 Payment Flow...");

    try {
      // 1. Setup Wallet Client
      const walletClient = createWalletClient({
        chain: cronosTestnet,
        transport: custom(ethereum)
      });

      // 2. CONNECT WALLET FIRST (Forces Popup)
      addLog("🔌 Requesting Wallet Connection...");
      const [address] = await walletClient.requestAddresses();
      addLog(`✅ Connected: ${address.slice(0,6)}...${address.slice(-4)}`);

      // 3. CHECK NETWORK (Auto-Switch)
      const chainId = await walletClient.getChainId();
      if (chainId !== cronosTestnet.id) {
        addLog(`⚠️ Wrong Network (${chainId}). Switching to Cronos...`);
        try {
          await walletClient.switchChain({ id: cronosTestnet.id });
          addLog("✅ Network Switched!");
        } catch (e) {
          throw new Error("User rejected network switch");
        }
      }

      // 4. SETUP PUBLIC CLIENT (For Reading Data)
      const publicClient = createPublicClient({
        chain: cronosTestnet,
        transport: http()
      });

      const amountToPay = parseUnits("1", 6); // 1.0 USDC

      // 5. CHECK ALLOWANCE
      addLog("🔍 Checking USDC Allowance...");
      const allowance = await publicClient.readContract({
        address: USDC_TOKEN_ADDRESS,
        abi: USDC_ABI,
        functionName: "allowance",
        args: [address, SANDBOX_CONTRACT_ADDRESS]
      });

      if (allowance < amountToPay) {
        addLog("⚠️ Allowance is 0. Requesting Approval...");
        addLog("👉 PLEASE CHECK METAMASK TO CONFIRM!");
        
        const hash = await walletClient.writeContract({
          address: USDC_TOKEN_ADDRESS,
          abi: USDC_ABI,
          functionName: "approve",
          args: [SANDBOX_CONTRACT_ADDRESS, amountToPay],
          account: address
        });
        
        addLog(`⏳ Approval Tx Sent. Waiting...`);
        await publicClient.waitForTransactionReceipt({ hash });
        addLog("✅ Approval Confirmed! Proceeding to pay...");
      }

      // 6. EXECUTE PAYMENT
      addLog("💸 Sending Payment...");
      const txHash = await walletClient.writeContract({
        address: SANDBOX_CONTRACT_ADDRESS,
        abi: SANDBOX_ABI,
        functionName: "payForResource",
        args: ["resource_123", amountToPay],
        account: address
      });

      addLog(`⏳ Transaction Sent: ${txHash}`);
      await publicClient.waitForTransactionReceipt({ hash: txHash });

      setStatus("SUCCESS");
      addLog("🎉 Payment Settled on Cronos Testnet!");

    } catch (error: any) {
      console.error(error);
      setStatus("ERROR");
      addLog(`❌ Error: ${error.message || "Unknown error"}`);
    }
  };

  return (
    <div className="p-4 border border-slate-700 bg-slate-900 rounded-lg space-y-4">
      <h3 className="text-cyan-400 font-bold">Sandbox Action</h3>
      
      <button 
        onClick={handlePayment}
        disabled={status === "PAYING"}
        className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded font-mono disabled:opacity-50"
      >
        {status === "IDLE" ? "▶ Run Payment Test" : status}
      </button>

      {/* The "Terminal" View */}
      <div className="bg-black p-3 rounded h-40 overflow-y-auto font-mono text-xs text-green-400">
        {logs.map((log, i) => <div key={i}>{log}</div>)}
      </div>
    </div>
  );
}