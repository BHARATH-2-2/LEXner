"use client";
import { useState } from "react";
import { api } from "../utils/api";

interface Message {
  sender: "user" | "bot";
  text: string;
}

export default function Chatbot() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  async function sendMessage(e: React.FormEvent) {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg = { sender: "user" as const, text: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await api.webhook({
        queryResult: {
          queryText: input,
          intent: { displayName: "general_chat" },
          parameters: { text: input },
        },
      });
      setMessages((prev) => [...prev, { sender: "bot", text: res.fulfillmentText }]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "⚠️ Backend error, check console" },
      ]);
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col w-full max-w-md mx-auto border rounded-2xl shadow p-4 h-[600px] bg-white">
      <div className="flex-1 overflow-y-auto mb-4 space-y-2">
        {messages.map((m, i) => (
          <div
            key={i}
            className={`p-2 rounded-xl max-w-[75%] ${
              m.sender === "user"
                ? "bg-blue-500 text-white ml-auto"
                : "bg-gray-200 text-black mr-auto"
            }`}
          >
            {m.text}
          </div>
        ))}
        {loading && <div className="text-sm text-gray-400">Bot is typing...</div>}
      </div>
      <form onSubmit={sendMessage} className="flex">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 border rounded-l-xl px-3 py-2 focus:outline-none"
          placeholder="Type a message..."
        />
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-r-xl">
          Send
        </button>
      </form>
    </div>
  );
}
