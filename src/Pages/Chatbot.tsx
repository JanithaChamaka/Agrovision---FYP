import { useEffect, useRef, useState } from "react";
import backgroundimage from "../assets/images/ava3.jpg";
import { Bot, User, History, Leaf } from "lucide-react";

// Utility to clean and format bot text
const formatBotText = (text: string) => {
  let clean = text.replace(/\*\*/g, ""); // remove Markdown **
  clean = clean
    .split("\n")
    .map((line) => {
      line = line.trim();
      if (line.startsWith("-")) return `• ${line.slice(1).trim()}`;
      return line;
    })
    .join("\n");
  return clean;
};

interface Message {
  sender: "user" | "bot";
  text: string;
}

interface Chat {
  id: number;
  title: string;
  messages: Message[];
}

const Chatbot = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: "bot",
      text: "Hello! I am AVA 🌱. How can I help with Sri Lankan agriculture today?",
    },
  ]);
  const [input, setInput] = useState("");
  const [chatHistory, setChatHistory] = useState<Chat[]>([]);
  const [activeChatId, setActiveChatId] = useState<number | null>(null);
  const bottomRef = useRef<HTMLDivElement | null>(null);

  // Start a new chat
  const newChat = () => {
    const newId = chatHistory.length + 1;
    const newChat: Chat = {
      id: newId,
      title: "New Chat",
      messages: [
        {
          sender: "bot",
          text: "Hello! I am AVA 🌱. How can I help with Sri Lankan agriculture today?",
        },
      ],
    };
    setChatHistory((prev) => [...prev, newChat]);
    setMessages(newChat.messages);
    setActiveChatId(newId);
  };

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
        "Content-Type": "application/json",
      };

      const payload = {
        model: "sonar-pro",
        messages: [
          {
            role: "system",
            content:
              "You are AVA, the Agrovision Virtual Agent. You provide helpful, accurate, and friendly answers about Sri Lankan agriculture, crops, fertilizers, diseases, government schemes, and market prices.",
          },
          { role: "user", content: trimmed },
        ],
        search_domain_filter: ["doa.gov.lk"],
        stream: true,
      };

      const response = await fetch(url, {
        method: "POST",
        headers,
        body: JSON.stringify(payload),
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

      // Save to history
      if (activeChatId !== null) {
        setChatHistory((prev) =>
          prev.map((chat) =>
            chat.id === activeChatId ? { ...chat, messages } : chat
          )
        );
      }
    } catch (error) {
      console.error("Error calling Perplexity API:", error);
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "Oops! Something went wrong. Please try again." },
      ]);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") sendMessage();
  };

  const loadChat = (id: number) => {
    const chat = chatHistory.find((c) => c.id === id);
    if (chat) {
      setMessages(chat.messages);
      setActiveChatId(chat.id);
    }
  };

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div
      className="flex flex-col h-screen"
      style={{
        backgroundImage: `url(${backgroundimage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="absolute inset-0 bg-black/50 "></div>

      {/* MAIN CHAT AREA */}
      <div className="flex flex-1 relative z-10 mt-15">
        {/* Sidebar for history */}
        <div className="w-64 h-full bg-[#1a2a20] text-white p-4">
          <div className="flex items-center gap-2 mb-4 text-lg font-semibold">
            <History size={20} /> Chat History
          </div>
          <button
            onClick={newChat}
            className="w-full bg-[#254336] py-2 rounded-lg mb-4 hover:bg-[#2f5646]"
          >
            ➕ New Chat
          </button>
          <div className="space-y-2 overflow-y-auto max-h-[75vh]">
            {chatHistory.map((chat) => (
              <div
                key={chat.id}
                onClick={() => loadChat(chat.id)}
                className={`p-2 rounded-lg cursor-pointer ${
                  chat.id === activeChatId
                    ? "bg-[#254336] text-white"
                    : "bg-white/10 hover:bg-white/20"
                }`}
              >
                {chat.title || `Chat ${chat.id}`}
              </div>
            ))}
          </div>
        </div>

        {/* Chat window */} 
     {/* Chat window */}
<div
  className="flex-1 flex flex-col rounded-2xl overflow-y-auto max-h-200
             backdrop-blur-xl bg-[rgba(17,25,40,0.75)] border border-white/20 shadow-lg m-6"
>
  {/* Chat header - stays fixed */}
  <div className="p-4 bg-[#254336]/90 text-white text-2xl  font-semibold">
    AVA 
  </div>

  {/* Messages - scrollable */}
  <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
    {messages.map((msg, i) => (
      <div
        key={i}
        className={`flex items-start gap-3 ${
          msg.sender === "user" ? "justify-end" : "justify-start"
        }`}
      >
        {msg.sender === "bot" && (
          <div className="w-10 h-10 flex items-center justify-center rounded-full bg-[#254336] text-white">
            <Bot size={20} />
          </div>
        )}
        <div
          className={`max-w-lg px-5 py-3 rounded-2xl text-base whitespace-pre-line shadow-md ${
            msg.sender === "user"
              ? "bg-[#254336] text-white"
              : "bg-white/90 text-gray-900"
          }`}
          dangerouslySetInnerHTML={{
            __html: msg.sender === "bot" ? formatBotText(msg.text) : msg.text,
          }}
        ></div>
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
  <div className="p-4 border-t border-white/20 flex items-center gap-2 bg-transparent flex-shrink-0">
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
    </div>
  );
};

export default Chatbot;
