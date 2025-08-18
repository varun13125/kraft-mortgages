"use client";
import { useState } from "react";
import { useAppStore } from "@/store/useAppStore";
import { ComplianceBanner } from "@/components/ComplianceBanner";

export function ChatAlex() {
  const { province, language } = useAppStore();
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<string[]>([]);

  async function send() {
    setMessages(prev => [...prev, `You: ${input}`]);
    const currentInput = input;
    setInput("");
    
    const res = await fetch("/api/chat/v2", { 
      method: "POST", 
      body: JSON.stringify({ 
        message: currentInput, 
        province, 
        language,
        stream: true 
      }), 
      headers: {"content-type":"application/json"} 
    });
    
    if (!res.ok) {
      setMessages(prev => [...prev, "Alex: Sorry, I'm having trouble connecting. Please try again."]);
      return;
    }
    
    const reader = res.body!.getReader();
    const decoder = new TextDecoder();
    let acc = "";
    setMessages(prev => [...prev, "Alex: "]);
    
    for(;;){
      const { value, done } = await reader.read();
      if (done) break;
      acc += decoder.decode(value);
      setMessages(prev => [...prev.slice(0, -1), `Alex: ${acc}`]);
    }
  }

  return (
    <div className="rounded-2xl metallic-card p-4 space-y-3">
      <ComplianceBanner feature="CHATBOT" />
      <div className="font-semibold text-white">Alex — Senior Mortgage Advisor</div>
      <div className="min-h-[120px] metallic-grey rounded p-3 text-sm">
        {messages.length === 0 ? <div className="text-gray-300">Ask about rates, qualification, or programs in BC/AB/ON.</div> : messages.map((m,i)=> <p key={i} className="text-gray-100">{m}</p>)}
      </div>
      <div className="flex gap-2">
        <input className="flex-1 metallic-grey border border-gray-600 rounded p-2 text-white placeholder-gray-400" value={input} onChange={e=>setInput(e.target.value)} placeholder="e.g., First home in Calgary..." />
        <button className="rounded px-4 py-2 bg-gold-500 hover:bg-gold-600 text-white transition-colors" onClick={send}>Send</button>
      </div>
    </div>
  );
}
