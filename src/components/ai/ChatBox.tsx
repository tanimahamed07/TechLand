"use client";

import React, { useState, useRef, useEffect } from "react";
import { Send, Bot, X } from "lucide-react";
import { chatWithAssistant } from "@/service/ai.service";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import toast from "react-hot-toast";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export default function ChatBox({ onClose }: { onClose?: () => void }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMessage: Message = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    const currentInput = input;
    setInput("");
    setLoading(true);

    try {
      const res = await chatWithAssistant({
        message: currentInput,
        history: messages,
      });

      if (res.success) {
        const botMessage: Message = {
          role: "assistant",
          content: res.data.reply,
        };
        setMessages((prev) => [...prev, botMessage]);
      }
    } catch (error: any) {
      toast.error("AI is busy right now.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[400px] w-[350px] sm:w-[380px] border rounded-2xl bg-background shadow-xl overflow-hidden mx-auto transition-all">
      {/* Header - Cross Icon সহ */}
      <div className="bg-primary p-3 text-primary-foreground flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <Bot className="w-5 h-5" />
          <h2 className="font-semibold text-xs tracking-tight">
            TechLand Assistant
          </h2>
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="p-1 hover:bg-muted/20 rounded-md transition-colors"
          aria-label="Close chat"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
          <div className="text-center py-10 text-muted-foreground italic text-[12px]">
            Hi! Ask me anything!
          </div>
        )}

        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[85%] break-words rounded-2xl px-3 py-2 text-[13px] leading-snug ${
                msg.role === "user"
                  ? "bg-primary text-primary-foreground rounded-tr-none"
                  : "bg-muted text-foreground rounded-tl-none border"
              }`}
            >
              {msg.content}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-muted px-3 py-2 rounded-2xl rounded-tl-none border">
              <span className="loading loading-dots loading-xs"></span>
            </div>
          </div>
        )}
        <div ref={scrollRef} />
      </div>

      {/* Input Area */}
      <div className="p-3 border-t bg-muted/20 shrink-0">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-2 w-full"
        >
          <div className="flex-1">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type..."
              className="rounded-full bg-background h-9 text-sm focus-visible:ring-1"
            />
          </div>
          <Button
            disabled={loading || !input.trim()}
            size="icon"
            className="rounded-full h-9 w-9 shrink-0 shadow-sm"
          >
            <Send className="w-4 h-4" />
          </Button>
        </form>
      </div>
    </div>
  );
}
