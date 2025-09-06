import { useEffect, useRef, useState } from "react";
import { Bot, Plus, Copy, Edit, MoreHorizontal } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";

interface Message {
  sender: "user" | "bot";
  text: string;
}

interface Chat {
  id: string; // conversation _id from backend
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
  const [searchTerm, setSearchTerm] = useState("");
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const { authUser } = useAuthStore();

  // Load chat history on mount
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/chat/chat/history", {
          credentials: "include",
        });
        const data = await res.json();

        if (Array.isArray(data) && data.length > 0) {
          const formattedChats: Chat[] = data.map((conv: any) => ({
            id: conv.conversationId,
            title: conv.title || "Chat",
            messages: conv.messages.map((m: any) => ({
              sender: m.senderType.toLowerCase(),
              text: m.text,
            })),
          }));
          setChatHistory(formattedChats);
          setActiveChatId(formattedChats[0].id);
          setMessages(formattedChats[0].messages);
        } else {
          newChat();
        }
      } catch (err) {
        console.error("Error loading history:", err);
      }
    };
    fetchHistory();
  }, []);

  const newChat = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/chat/chat/new", {
        method: "POST",
        credentials: "include",
      });
      const data = await res.json();
      const chat: Chat = {
        id: data.conversationId,
        title: data.title || "New Chat",
        messages: [],
      };
      setChatHistory((prev) => [chat, ...prev]);
      setActiveChatId(chat.id);
      setMessages([]);
    } catch (err) {
      console.error("Error creating new chat:", err);
    }
  };

  const sendMessage = async () => {
    if (!input.trim()) return;

    const messageToSend = input.trim();
    setMessages((prev) => [...prev, { sender: "user", text: messageToSend }]);
    setInput("");

    try {
      const res = await fetch("http://localhost:5000/api/chat/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ text: messageToSend, senderType: "user" }),
      });

      const data = await res.json();
      console.log("Bot response data:", data);

      if (data.conversationId) setActiveChatId(data.conversationId);
      setMessages((prev) => [...prev, { sender: "bot", text: data.botReply }]);

      // Update chatHistory with new message
      setChatHistory((prev) =>
        prev.map((chat) =>
          chat.id === data.conversationId
            ? { ...chat, messages: [...chat.messages, { sender: "user", text: messageToSend }, { sender: "bot", text: data.botReply }] }
            : chat
        )
      );
    } catch (err) {
      console.error(err);
      console.log("Failed to send message",err);
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

  const filteredChats = chatHistory.filter((chat) =>
    chat.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex h-[600px] max-h-2xl bg-gray-50 mt-16">
      {/* Sidebar */}
      <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center" />
            <span className="font-semibold text-gray-900">AVA</span>
          </div>
          <button
            onClick={newChat}
            className="w-full bg-gray-900 text-white py-2.5 px-4 rounded-lg hover:bg-gray-800 transition-colors flex items-center justify-center gap-2 font-medium"
          >
            <Plus size={18} />
            New Chat
          </button>
        </div>

        {/* Chat History */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-4">
            <h3 className="text-sm font-medium text-gray-500 mb-3">History Chat</h3>
            <div className="space-y-2">
              {filteredChats.map((chat) => (
                <div
                  key={chat.id}
                  onClick={() => loadChat(chat.id)}
                  className={`p-3 rounded-lg cursor-pointer transition-colors ${
                    chat.id === activeChatId ? "bg-green-50 border border-green-200" : "hover:bg-gray-50"
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-medium text-gray-900 truncate">{chat.title}</h4>
                      <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                        {chat.messages[0]?.text?.substring(0, 50)}...
                      </p>
                    </div>
                    <button className="ml-2 p-1 hover:bg-gray-200 rounded">
                      <MoreHorizontal size={14} className="text-gray-400" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col p-6">
        <div className="flex-1 flex flex-col bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden">
          {/* Chat Header */}
          <div className="bg-white border-b border-gray-200 p-4 rounded-t-2xl">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">AVA Chat</h2>
              <div className="flex items-center gap-2">
                <button className="p-2 hover:bg-gray-100 rounded-lg">
                  <MoreHorizontal size={18} className="text-gray-400" />
                </button>
              </div>
            </div>
            <p className="text-sm text-gray-500 mt-1">
              Agrovision Virtual Agent - Ask me anything and I'll help you with detailed responses.
            </p>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto bg-gray-50 p-6">
            <div className="max-w-8xl">
              {messages.map((msg, i) => (
                <div key={i} className="group">
                  <div className={`flex gap-4 ${msg.sender === "user" ? "flex-row-reverse" : ""}`}>
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                        msg.sender === "bot" ? "bg-green-100 text-green-600" : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {msg.sender === "bot" ? <Bot size={20} /> : <div>{authUser?.name?.charAt(0)?.toUpperCase() || "U"}</div>}
                    </div>

                    <div className={`flex-1 ${msg.sender === "user" ? "text-right" : ""}`}>
                      <div
                        className={`inline-block max-w-3xl text-left ${
                          msg.sender === "user"
                            ? "bg-gray-900 text-white px-4 py-3 rounded-2xl rounded-tr-sm"
                            : "bg-white text-gray-900 px-4 py-3 rounded-2xl rounded-tl-sm shadow-sm"
                        }`}
                      >
                        <div className="whitespace-pre-line leading-relaxed">
                          {msg.sender === "bot" ? formatBotText(msg.text) : msg.text}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              <div ref={bottomRef}></div>
            </div>
          </div>

          {/* Input Area */}
          <div className="bg-white border-t border-gray-200 p-4 rounded-b-2xl">
            <div className="max-w-4xl mx-auto flex items-center gap-3">
              <input
                type="text"
                placeholder="Ask me anything..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyPress}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
              <button
                onClick={sendMessage}
                disabled={!input.trim()}
                className="bg-gray-900 text-white p-3 rounded-xl hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Send
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;
