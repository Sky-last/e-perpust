import React, { useState, useEffect, useRef, useCallback } from "react";
import { X, Send, MessageCircle, ChevronDown, User as UserIcon } from "lucide-react";
import { User, ChatMessage } from "../types";
import { sendChatMessage, getChatMessages, markSessionReadByUser, upsertChatSession, subscribeChatMessages } from "../lib/chatDb";

interface LiveChatWidgetProps {
  currentUser: User | null;
  onRequestLogin?: () => void;
}

export default function LiveChatWidget({ currentUser, onRequestLogin }: LiveChatWidgetProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const bottomRef = useRef<HTMLDivElement>(null);
  const pollingRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const sessionId = currentUser?.id || "";

  const loadMessages = useCallback(async () => {
    if (!sessionId) return;
    const msgs = await getChatMessages(sessionId);
    setMessages(msgs);
    const unread = msgs.filter(m => m.senderRole === "admin" && !m.isRead).length;
    if (!isOpen) setUnreadCount(unread);
  }, [sessionId, isOpen]);

  // Polling every 3 seconds for new messages
  useEffect(() => {
    if (!sessionId) return;
    loadMessages();
    pollingRef.current = setInterval(loadMessages, 3000);
    return () => { if (pollingRef.current) clearInterval(pollingRef.current); };
  }, [sessionId, loadMessages]);

  // Supabase Realtime subscription
  useEffect(() => {
    if (!sessionId) return;
    const unsub = subscribeChatMessages(sessionId, (newMsg) => {
      setMessages(prev => [...prev, newMsg]);
      if (!isOpen && newMsg.senderRole === "admin") {
        setUnreadCount(c => c + 1);
      }
    });
    return unsub;
  }, [sessionId, isOpen]);

  // Register session when user opens chat
  useEffect(() => {
    if (isOpen && currentUser) {
      upsertChatSession({
        id: currentUser.id,
        userId: currentUser.id,
        userName: currentUser.name,
        userEmail: currentUser.email,
      });
      markSessionReadByUser(currentUser.id);
      setUnreadCount(0);
    }
  }, [isOpen, currentUser]);

  // Scroll to bottom on new message
  useEffect(() => {
    if (isOpen) bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isOpen]);

  const handleSend = async () => {
    if (!input.trim() || !currentUser || isSending) return;
    setIsSending(true);
    const text = input.trim();
    setInput("");
    await sendChatMessage({
      sessionId: currentUser.id,
      senderId: currentUser.id,
      senderName: currentUser.name,
      senderRole: "user",
      text,
    });
    await loadMessages();
    setIsSending(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); }
  };

  const formatTime = (ts: string) => {
    try {
      return new Date(ts).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" });
    } catch { return ""; }
  };

  // Not logged in — show prompt
  if (!currentUser) {
    return (
      <div className="fixed bottom-24 right-4 z-40 md:bottom-6 md:right-6">
        <button
          onClick={() => onRequestLogin?.()}
          className="w-14 h-14 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-2xl shadow-emerald-500/40 flex items-center justify-center hover:scale-110 active:scale-95 transition-all duration-200 cursor-pointer"
          title="Chat dengan Admin"
        >
          <MessageCircle className="w-6 h-6" />
        </button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-24 right-4 z-40 md:bottom-6 md:right-6 flex flex-col items-end gap-3">
      {/* Chat Panel */}
      {isOpen && (
        <div className="w-[320px] sm:w-[360px] bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl shadow-slate-900/50 flex flex-col overflow-hidden" style={{ height: 440 }}>
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                <UserIcon className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="text-xs font-black text-white">Admin Perpustakaan</p>
                <span className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-300 animate-pulse inline-block" />
                  <span className="text-[10px] text-emerald-100 font-medium">Online</span>
                </span>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white/70 hover:text-white p-1 rounded-lg hover:bg-white/10 cursor-pointer transition-colors"
            >
              <ChevronDown className="w-4 h-4" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3 bg-slate-950/60">
            {messages.length === 0 && (
              <div className="flex flex-col items-center justify-center h-full text-center py-6">
                <MessageCircle className="w-10 h-10 text-slate-600 mb-3" />
                <p className="text-xs text-slate-500 font-semibold">Belum ada pesan</p>
                <p className="text-[11px] text-slate-600 mt-1">Kirim pesan untuk memulai chat dengan admin</p>
              </div>
            )}
            {messages.map(msg => (
              <div key={msg.id} className={`flex ${msg.senderRole === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[75%] rounded-2xl px-3 py-2 text-xs shadow-sm ${
                  msg.senderRole === "user"
                    ? "bg-gradient-to-br from-emerald-500 to-teal-600 text-white rounded-br-sm"
                    : "bg-slate-800 text-slate-200 border border-slate-700 rounded-bl-sm"
                }`}>
                  {msg.senderRole === "admin" && (
                    <p className="text-[9px] font-extrabold text-emerald-400 mb-0.5 uppercase">Admin</p>
                  )}
                  <p className="leading-relaxed break-words">{msg.text}</p>
                  <p className={`text-[9px] mt-1 ${msg.senderRole === "user" ? "text-emerald-100/70" : "text-slate-500"} text-right`}>
                    {formatTime(msg.timestamp)}
                  </p>
                </div>
              </div>
            ))}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div className="px-3 py-2.5 border-t border-slate-800 bg-slate-900 shrink-0 flex items-end gap-2">
            <textarea
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ketik pesan..."
              rows={1}
              className="flex-1 resize-none bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors"
              style={{ maxHeight: 80 }}
            />
            <button
              onClick={handleSend}
              disabled={!input.trim() || isSending}
              className="w-8 h-8 shrink-0 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white flex items-center justify-center disabled:opacity-40 cursor-pointer active:scale-90 transition-all"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* FAB Button */}
      <button
        onClick={() => setIsOpen(o => !o)}
        className="relative w-14 h-14 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-2xl shadow-emerald-500/40 flex items-center justify-center hover:scale-110 active:scale-95 transition-all duration-200 cursor-pointer"
        title="Chat dengan Admin"
      >
        {isOpen ? <X className="w-5 h-5" /> : <MessageCircle className="w-6 h-6" />}
        {!isOpen && unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-red-500 text-white text-[10px] font-black flex items-center justify-center shadow-lg animate-bounce">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>
    </div>
  );
}
