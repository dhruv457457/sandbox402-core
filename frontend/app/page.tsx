"use client";

import { useState } from "react";
import { 
  Terminal, 
  PlayCircle, 
  ShieldCheck, 
  Activity, 
  Search, 
  Database,
  Lock,
  Unlock,
  ArrowRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SandboxPayment from "@/components/SandboxPayment";

export default function Home() {
  // State for the Request Builder
  const [method, setMethod] = useState("GET");
  const [url, setUrl] = useState("https://api.cronos.org/v1/premium-data");
  const [requestStatus, setRequestStatus] = useState<"IDLE" | "LOADING" | "402_REQUIRED" | "SUCCESS">("IDLE");

  // Mock function to simulate sending the initial request
  const handleSendRequest = () => {
    setRequestStatus("LOADING");
    
    // Fake network delay
    setTimeout(() => {
      setRequestStatus("402_REQUIRED");
    }, 800);
  };

  return (
    <main className="min-h-screen bg-slate-950 p-6 font-sans text-slate-200 selection:bg-cyan-900 selection:text-cyan-50">
      
      {/* 1. TOP NAVIGATION BAR */}
      <header className="mb-8 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-cyan-900/30 border border-cyan-500/50 text-cyan-400">
            <ShieldCheck size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-white text-glow">
              Sandbox<span className="text-cyan-400">402</span>
            </h1>
            <p className="text-xs text-slate-500 font-mono">Cronos x402 Infrastructure & Debugger</p>
          </div>
        </div>
        
        <div className="flex gap-4">
           <Badge variant="outline" className="bg-yellow-500/10 text-yellow-500 border-yellow-500/30 px-3 py-1">
             ⚠️ Testnet Mode
           </Badge>
           <Button variant="ghost" className="text-slate-400 hover:text-white">Docs</Button>
           <Button className="bg-cyan-600 hover:bg-cyan-500 text-white shadow-lg shadow-cyan-900/20">
             Connect Wallet
           </Button>
        </div>
      </header>

      {/* 2. MAIN GRID LAYOUT */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* LEFT COLUMN: REQUEST BUILDER (The "Trigger") */}
        <div className="lg:col-span-5 space-y-6">
          <Card className="glass-card border-slate-800 bg-slate-900/60">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-slate-100">
                <Terminal size={18} className="text-cyan-400" /> 
                Request Builder
              </CardTitle>
              <CardDescription>Simulate an Agent calling a paid API.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              
              {/* Method & URL Input */}
              <div className="flex gap-2">
                <select 
                  value={method}
                  onChange={(e) => setMethod(e.target.value)}
                  className="bg-slate-950 border border-slate-700 rounded-md px-3 py-2 text-sm font-mono text-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
                >
                  <option>GET</option>
                  <option>POST</option>
                  <option>PUT</option>
                </select>
                <Input 
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  className="bg-slate-950 border-slate-700 font-mono text-sm text-slate-300 placeholder:text-slate-600"
                  placeholder="https://api..."
                />
              </div>

              {/* Tabs for Headers/Body */}
              <Tabs defaultValue="headers" className="w-full">
                <TabsList className="bg-slate-950/50 border border-slate-800">
                  <TabsTrigger value="headers">Headers</TabsTrigger>
                  <TabsTrigger value="body">Body</TabsTrigger>
                  <TabsTrigger value="auth">Auth</TabsTrigger>
                </TabsList>
                <TabsContent value="headers" className="mt-4 space-y-2">
                  <div className="flex gap-2">
                    <Input placeholder="Accept" className="bg-slate-950/50 border-slate-800 font-mono text-xs" disabled value="Content-Type" />
                    <Input placeholder="application/json" className="bg-slate-950/50 border-slate-800 font-mono text-xs" disabled value="application/json" />
                  </div>
                  <div className="flex gap-2 opacity-50">
                    <Input placeholder="Key" className="bg-slate-950/50 border-slate-800 font-mono text-xs" />
                    <Input placeholder="Value" className="bg-slate-950/50 border-slate-800 font-mono text-xs" />
                  </div>
                </TabsContent>
                <TabsContent value="body">
                  <textarea 
                    className="w-full h-32 bg-slate-950 border border-slate-800 rounded-md p-3 font-mono text-xs text-slate-400 focus:outline-none focus:border-cyan-500/50 transition-colors"
                    defaultValue={`{\n  "agent_id": "cronos-bot-01",\n  "query": "fetch_market_depth"\n}`}
                  />
                </TabsContent>
              </Tabs>

              {/* Send Button */}
              <Button 
                onClick={handleSendRequest}
                disabled={requestStatus === "LOADING" || requestStatus === "402_REQUIRED"}
                className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-medium"
              >
                {requestStatus === "LOADING" ? (
                  <Activity className="animate-spin mr-2" size={18} />
                ) : (
                  <PlayCircle className="mr-2" size={18} />
                )}
                {requestStatus === "LOADING" ? "Sending Request..." : "Send Request"}
              </Button>

            </CardContent>
          </Card>
          
          {/* Helper Info Card */}
          <div className="p-4 rounded-lg border border-blue-900/30 bg-blue-950/20 text-blue-200 text-sm flex gap-3">
             <div className="mt-1"><Search size={16} /></div>
             <p>
               <strong>Tip:</strong> This request simulates an AI Agent trying to access a premium endpoint. 
               The Sandbox will intercept the 402 error automatically.
             </p>
          </div>
        </div>

        {/* RIGHT COLUMN: INSPECTOR & VISUALIZER (The "Solution") */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* THE VISUALIZER CARD */}
          <Card className="glass-card border-slate-800 bg-slate-900/60 min-h-[500px]">
            <CardHeader className="border-b border-slate-800 pb-4">
              <CardTitle className="flex items-center justify-between text-slate-100">
                <span className="flex items-center gap-2">
                  <Activity size={18} className="text-purple-400" /> 
                  Flow Visualizer
                </span>
                {requestStatus === "402_REQUIRED" && (
                   <Badge variant="destructive" className="animate-pulse bg-red-900/50 text-red-400 border-red-500/30">
                     HTTP 402 DETECTED
                   </Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              
              {/* TIMELINE COMPONENT */}
              <div className="relative space-y-8 ml-2">
                {/* Vertical Line */}
                <div className="absolute left-[15px] top-2 bottom-2 w-0.5 bg-slate-800"></div>

                {/* STEP 1: INITIAL REQUEST */}
                <div className="relative flex gap-4">
                  <div className={`relative z-10 w-8 h-8 rounded-full flex items-center justify-center border-2 
                    ${requestStatus === "IDLE" ? "bg-slate-900 border-slate-700 text-slate-500" : 
                      requestStatus === "LOADING" ? "bg-yellow-900/20 border-yellow-500 text-yellow-500" :
                      "bg-red-950 border-red-500 text-red-500"
                    }`}>
                    <Lock size={14} />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-sm font-semibold text-slate-200">1. Initial Request</h3>
                    <p className="text-xs text-slate-500 font-mono mt-1">
                      {requestStatus === "IDLE" ? "Waiting for input..." : 
                       requestStatus === "LOADING" ? "Sending HTTP GET..." : 
                       "Blocked: Payment Required"}
                    </p>
                    {requestStatus === "402_REQUIRED" && (
                      <div className="mt-2 code-block">
                        <p className="text-red-400">{`< HTTP/1.1 402 Payment Required`}</p>
                        <p className="text-slate-400">x-402-token: <span className="text-cyan-400">USDC (Cronos)</span></p>
                        <p className="text-slate-400">x-402-amount: <span className="text-cyan-400">1000000 (1.0)</span></p>
                        <p className="text-slate-400">x-402-recipient: <span className="text-purple-400">0xE4e...91c</span></p>
                      </div>
                    )}
                  </div>
                </div>

                {/* STEP 2: SETTLEMENT ACTION (Visible only if 402 detected) */}
                <div className={`relative flex gap-4 transition-opacity duration-500 ${requestStatus === "402_REQUIRED" ? "opacity-100" : "opacity-30 blur-[1px]"}`}>
                  <div className="relative z-10 w-8 h-8 rounded-full bg-slate-900 border-2 border-slate-700 flex items-center justify-center text-slate-500">
                    <Database size={14} />
                  </div>
                  <div className="flex-1 space-y-3">
                    <h3 className="text-sm font-semibold text-slate-200">2. Settlement & Simulation</h3>
                    <p className="text-xs text-slate-500 font-mono">
                      Authorize payment to unlock the resource.
                    </p>
                    
                    {/* THIS IS YOUR CUSTOM COMPONENT */}
                    {requestStatus === "402_REQUIRED" && (
                      <div className="animate-in fade-in slide-in-from-top-4 duration-500">
                        <SandboxPayment />
                      </div>
                    )}
                  </div>
                </div>

                {/* STEP 3: FINAL ACCESS */}
                <div className="relative flex gap-4 opacity-30">
                  <div className="relative z-10 w-8 h-8 rounded-full bg-slate-900 border-2 border-slate-700 flex items-center justify-center text-slate-500">
                    <Unlock size={14} />
                  </div>
                  <div className="flex-1">
                     <h3 className="text-sm font-semibold text-slate-200">3. Resource Unlocked</h3>
                     <p className="text-xs text-slate-500 font-mono">Data delivered to Agent.</p>
                  </div>
                </div>

              </div>
            </CardContent>
          </Card>

        </div>
      </div>
    </main>
  );
}