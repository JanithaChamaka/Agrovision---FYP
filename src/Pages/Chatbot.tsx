import { useEffect, useRef, useState } from "react";
import backgroundimage from "../assets/images/Ava1.jpg"; // ✅ import your background
import { Bot, User } from "lucide-react"; // ✅ nice icons for avatars

interface Message {
  sender: "user" | "bot";
  text: string;
}

const Chatbot = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: "bot",
      text: "Hello! I am AVA 🌱. How can I help with Sri Lankan agriculture today?"
    }
  ]);
  const [input, setInput] = useState("");
  const bottomRef = useRef<HTMLDivElement | null>(null);

  const sendMessage = async () => {
    const trimmed = input.trim();
    if (!trimmed) return;

    setMessages((prev) => [...prev, { sender: "user", text: trimmed }]);
    setInput("");

    const botIndex = messages.length + 1;
    setMessages((prev) => [...prev, { sender: "bot", text: "" }]);

    try {
      const url = "https://api.perplexity.ai/chat/completions";
      const headers = {
        Authorization: `Bearer ${import.meta.env.VITE_CHATBOT_API_KEY}`,
        "Content-Type": "application/json"
      };

      const payload = {
        model: "sonar-pro",
        messages: [
          {
            role: "system",
            content:
              "You are AVA, the Agrovision Virtual Agent. You provide helpful, accurate, and friendly answers about Sri Lankan agriculture, crops, fertilizers, diseases, government schemes, and market prices."
          },
          { role: "user", content: trimmed }
        ],
        search_domain_filter: ["doa.gov.lk"],
        stream: true
      };

      const response = await fetch(url, {
        method: "POST",
        headers,
        body: JSON.stringify(payload)
      });

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      let fullText = "";

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value, { stream: true });
          const lines = chunk.split("\n").filter((line) => line.trim() !== "");

          for (const line of lines) {
            if (line.startsWith("data:")) {
              const jsonStr = line.replace(/^data:\s*/, "");
              if (jsonStr === "[DONE]") break;

              try {
                const parsed = JSON.parse(jsonStr);
                const delta = parsed?.choices?.[0]?.delta?.content || "";
                if (delta) {
                  fullText += delta;
                  setMessages((prev) => {
                    const updated = [...prev];
                    updated[botIndex] = { sender: "bot", text: fullText };
                    return updated;
                  });
                }
              } catch (err) {
                console.error("Stream parse error", err);
              }
            }
          }
        }
      }
    } catch (error) {
      console.error("Error calling Perplexity API:", error);
      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: "Oops! Something went wrong. Please try again."
        }
      ]);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") sendMessage();
  };

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div
      className="flex items-center justify-center h-screen relative"
      style={{
        backgroundImage: `url(${backgroundimage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat"
      }}
    >
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/50"></div>

      {/* Chat container with glass effect */}
      <div
        className="relative w-[70%] h-[70%] rounded-2xl flex flex-col overflow-hidden z-10
                   backdrop-blur-xl bg-[rgba(17,25,40,0.75)] border border-white/20 shadow-lg"
      >
        {/* Header */}
        <div className="p-4 bg-[#254336]/90 text-white text-2xl font-semibold">
          AVA - Agrovision Virtual Agent
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`flex items-start gap-3 ${
                msg.sender === "user" ? "justify-end" : "justify-start"
              }`}
            >
              {/* Avatar */}
              {msg.sender === "bot" && (
                <div className="w-10 h-10 flex items-center justify-center rounded-full bg-[#254336] text-white">
                  <Bot size={20} />
                </div>
              )}

              {/* Message bubble */}
              <div
                className={`max-w-lg px-5 py-3 rounded-2xl text-base whitespace-pre-line shadow-md ${
                  msg.sender === "user"
                    ? "bg-[#254336] text-white"
                    : "bg-white/80 text-gray-900"
                }`}
              >
                {msg.text}
              </div>

              {msg.sender === "user" && (
                <div className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-300 text-gray-800">
                  <User size={20} />
                </div>
              )}
            </div>
          ))}
          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <div className="p-4 border-t border-white/20 flex items-center gap-2 bg-transparent">
          <input
            type="text"
            className="flex-1 border border-white/30 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#254336] bg-white/20 text-white placeholder-gray-300"
            placeholder="Type your message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyPress}
          />
          <button
            onClick={sendMessage}
            className="bg-[#254336] text-white px-6 py-2 rounded-full hover:bg-[#1a2a20] transition"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;
