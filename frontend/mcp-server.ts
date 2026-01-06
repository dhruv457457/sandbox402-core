import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { createPublicClient, http, parseAbi } from "viem";
import { cronosTestnet } from "viem/chains";

// 1. Setup the "Eyes" (Blockchain Client)
const client = createPublicClient({
  chain: cronosTestnet,
  transport: http(),
});

// 2. Define your Sandbox Contracts (from your earlier deployment)
const USDC_ADDRESS = "0xc01efAaF7C5C61bEbFAeb358E1161b537b8bC0e0"; 
const SANDBOX_ADDRESS = "0xE4e422626a10246C8B19Bd0e0eA0535257BBF91c"; 

// 3. Initialize the MCP Server
const server = new McpServer({
  name: "Sandbox402 Inspector",
  version: "1.0.0",
});

// --- TOOL 1: Check Payment Status ---
server.tool(
  "check_payment_status",
  { txHash: z.string().describe("The transaction hash to check") },
  async ({ txHash }) => {
    try {
      const receipt = await client.getTransactionReceipt({ hash: txHash as `0x${string}` });
      
      if (receipt.status === "success") {
        return {
          content: [{ type: "text", text: `✅ Payment Success! \nBlock: ${receipt.blockNumber}\nGas Used: ${receipt.gasUsed}` }],
        };
      } else {
        return {
          content: [{ type: "text", text: "❌ Payment Failed on-chain (Reverted)." }],
        };
      }
    } catch (error: any) {
      return {
        content: [{ type: "text", text: `⚠️ Error finding transaction: ${error.message}` }],
      };
    }
  }
);

// --- TOOL 2: Debug Allowance (The "Why it failed" tool) ---
server.tool(
  "debug_allowance",
  { walletAddress: z.string().describe("The user's wallet address") },
  async ({ walletAddress }) => {
    const abi = parseAbi(["function allowance(address, address) view returns (uint256)"]);
    
    const allowance = await client.readContract({
      address: USDC_ADDRESS,
      abi: abi,
      functionName: "allowance",
      args: [walletAddress as `0x${string}`, SANDBOX_ADDRESS],
    });

    const allowanceVal = Number(allowance);
    
    if (allowanceVal === 0) {
      return {
        content: [{ 
          type: "text", 
          text: `🚨 CRITICAL ERROR: Allowance is 0.\nThe user MUST approve the Sandbox contract before paying.\n\nFix: Call USDC.approve(${SANDBOX_ADDRESS}, 1000000)` 
        }],
      };
    }

    return {
      content: [{ type: "text", text: `✅ Allowance Looks Good: ${allowanceVal} units authorized.` }],
    };
  }
);

// 4. Start the Server (StdIO mode for Claude Desktop)
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("Sandbox402 MCP Server running on stdio...");
}

main().catch((error) => {
  console.error("Server error:", error);
  process.exit(1);
});