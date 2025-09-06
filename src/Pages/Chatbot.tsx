import { useEffect, useRef, useState } from "react";
import backgroundimage from "../assets/images/ava3.jpg";
import { Bot, User, History } from "lucide-react";
import Avatar from "react-avatar";
import { useAuthStore } from "../store/useAuthStore";

interface Message {
  sender: "user" | "bot";
  text: string;
}

interface Chat {
  id: string; // use conversation _id from backend
  title: string;
  messages: Message[];
}

const formatBotText = (text: string) => {
  let clean = text.replace(/\*\*/g, "");
  clean = clean
    .split("\n")
    .map((line) => (line.startsWith("-") ? `• ${line.slice(1).trim()}` : line))
    .join("\n");
  return clean;
};

const Chatbot = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [chatHistory, setChatHistory] = useState<Chat[]>([]);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement | null>(null);
const { authUser } = useAuthStore();
  // Load chat history on mount
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/chat/history", {
          credentials: "include", // for cookies/auth
        });
        const data = await res.json();
        if (data.messages?.length) {
          const formatted = data.messages.map((m: any) => ({
            sender: m.senderType.toLowerCase(),
            text: m.text,
          }));
          setMessages(formatted);
          setActiveChatId(data.conversationId);
          setChatHistory([
            {
              id: data.conversationId,
              title: "Previous Chat",
              messages: formatted,
            },
          ]);
        } else {
          // Start a new chat if no history
          newChat();
        }
      } catch (err) {
        console.error("Error loading history:", err);
      }
    };
    fetchHistory();
  }, []);

  const newChat = () => {
    const newId = Date.now().toString();
    const newChat: Chat = {
      id: newId,
      title: "New Chat",
      messages: [],
    };
    setChatHistory((prev) => [...prev, newChat]);
    setMessages([]);
    setActiveChatId(newId);
  };

const sendMessage = async () => {
  if (!input.trim()) return;

  const messageToSend = input.trim();
  setMessages((prev) => [...prev, { sender: "user", text: messageToSend }]);
  setInput("");

  try {
    const res = await fetch("http://localhost:5000/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ text: messageToSend, senderType: "user" }),
    });

    const data = await res.json();

    if (data.conversationId) setActiveChatId(data.conversationId);
    setMessages((prev) => [...prev, { sender: "bot", text: data.botReply }]);
  } catch (err) {
    console.error(err);
    setMessages((prev) => [...prev, { sender: "bot", text: "Error sending message." }]);
  }
};


  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") sendMessage();
  };

  const loadChat = (id: string) => {
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
      className="flex flex-col h-screen relative"
      style={{
        backgroundImage: `url(${backgroundimage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="absolute inset-0 bg-black/50"></div>

      <div className="flex flex-1 relative z-10 mt-15">
        {/* Sidebar */}
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
                {chat.title || "Chat"}
              </div>
            ))}
          </div>
        </div>

        {/* Chat Window */}
        <div className="flex-1 flex flex-col rounded-2xl overflow-y-auto   max-h-[85vh]    backdrop-blur-xl bg-[rgba(17,25,40,0.75)] border border-white/20 shadow-lg m-6">
          <div className="p-4 bg-[#254336]/90 text-white text-2xl font-semibold">
            AVA
          </div>

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
                >
                  {msg.sender === "bot" ? formatBotText(msg.text) : msg.text}
                </div>
                {msg.sender === "user" && (
                  <div className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-300 text-gray-800">
                         <Avatar name={authUser?.name || "User"} round={true} size="30" color="#99B669" />
                  </div>
                )}
              </div>
            ))}
            <div ref={bottomRef}></div>
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