import React, { useState, useEffect, useRef, useCallback } from "react";
import { MessageCircle, Send, Search, User as UserIcon, CheckCheck, Clock, RefreshCw, MessageSquare } from "lucide-react";
import { ChatMessage, ChatSession, User } from "../types";
import { getAllChatSessions, getChatMessages, sendChatMessage, markSessionReadByAdmin, subscribeChatMessages } from "../lib/chatDb";

interface AdminChatPanelProps {
  currentUser?: User | null;
  addToast?: (message: string, type: 'success' | 'error' | 'info') => void;
}

export default function AdminChatPanel({ currentUser, addToast }: AdminChatPanelProps) {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [replyInput, setReplyInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  const loadSessions = useCallback(async () => {
    const list = await getAllChatSessions();
    setSessions(list);
  }, []);

  const loadMessages = useCallback(async (sessionId: string) => {
    const msgs = await getChatMessages(sessionId);
    setMessages(msgs);
    await markSessionReadByAdmin(sessionId);
    loadSessions();
  }, [loadSessions]);

  // Initial load & periodic refresh of session list
  useEffect(() => {
    loadSessions();
    const interval = setInterval(loadSessions, 4000);
    return () => clearInterval(interval);
  }, [loadSessions]);

  // Load messages when selecting a session
  useEffect(() => {
    if (selectedSessionId) {
      loadMessages(selectedSessionId);
      const interval = setInterval(() => loadMessages(selectedSessionId), 3000);
      return () => clearInterval(interval);
    }
  }, [selectedSessionId, loadMessages]);

  // Supabase Realtime subscription for active chat session
  useEffect(() => {
    if (!selectedSessionId) return;
    const unsub = subscribeChatMessages(selectedSessionId, (newMsg) => {
      setMessages(prev => [...prev, newMsg]);
      if (newMsg.senderRole === 'user') {
        markSessionReadByAdmin(selectedSessionId);
      }
    });
    return unsub;
  }, [selectedSessionId]);

  // Scroll to bottom on new message
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendReply = async () => {
    if (!selectedSessionId || !replyInput.trim() || isSending) return;
    setIsSending(true);
    const text = replyInput.trim();
    setReplyInput("");

    try {
      await sendChatMessage({
        sessionId: selectedSessionId,
        senderId: currentUser?.id || "admin",
        senderName: currentUser?.name || "Admin Perpustakaan",
        senderRole: "admin",
        text,
      });

      await loadMessages(selectedSessionId);
    } catch (e) {
      addToast?.("Gagal mengirim pesan", "error");
    } finally {
      setIsSending(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendReply();
    }
  };

  const filteredSessions = sessions.filter(s =>
    s.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.lastMessage.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectedSession = sessions.find(s => s.id === selectedSessionId);

  const formatTime = (ts: string) => {
    if (!ts) return "";
    try {
      const d = new Date(ts);
      const isToday = new Date().toDateString() === d.toDateString();
      return isToday
        ? d.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })
        : d.toLocaleDateString("id-ID", { day: "numeric", month: "short" });
    } catch { return ""; }
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden flex flex-col md:flex-row min-h-[580px] max-h-[700px]">
      {/* LEFT COLUMN: SESSIONS LIST */}
      <div className="w-full md:w-80 border-r border-slate-100 flex flex-col bg-slate-50/50 shrink-0">
        {/* Header & Search */}
        <div className="p-4 border-b border-slate-100 space-y-3 bg-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl">
                <MessageSquare className="w-4 h-4" />
              </div>
              <h2 className="text-sm font-extrabold text-slate-800">Live Chat Desk</h2>
            </div>
            <button
              onClick={loadSessions}
              className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer transition-colors"
              title="Refresh Sesi"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Cari percakapan..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 bg-slate-100 border border-transparent rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:bg-white focus:border-emerald-500 focus:outline-none transition-all"
            />
          </div>
        </div>

        {/* Sessions List */}
        <div className="flex-1 overflow-y-auto divide-y divide-slate-100/60">
          {filteredSessions.length === 0 ? (
            <div className="p-8 text-center text-slate-400 space-y-2">
              <MessageCircle className="w-8 h-8 mx-auto text-slate-300" />
              <p className="text-xs font-semibold">Belum ada obrolan</p>
              <p className="text-[11px] text-slate-400">Pesan dari anggota perpustakaan akan muncul di sini.</p>
            </div>
          ) : (
            filteredSessions.map(session => {
              const isSelected = session.id === selectedSessionId;
              const hasUnread = session.unreadByAdmin > 0;

              return (
                <button
                  key={session.id}
                  onClick={() => setSelectedSessionId(session.id)}
                  className={`w-full p-3.5 text-left flex items-start gap-3 transition-colors cursor-pointer ${
                    isSelected ? "bg-emerald-50/70 border-l-4 border-emerald-500" : "hover:bg-slate-100/70"
                  }`}
                >
                  <div className="relative shrink-0">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 text-white flex items-center justify-center font-bold text-xs shadow-xs">
                      {session.userName ? session.userName.charAt(0).toUpperCase() : <UserIcon className="w-4 h-4" />}
                    </div>
                    {hasUnread && (
                      <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500 text-white text-[9px] font-black flex items-center justify-center border-2 border-white">
                        {session.unreadByAdmin}
                      </span>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1 mb-0.5">
                      <span className={`text-xs truncate ${hasUnread ? "font-extrabold text-slate-900" : "font-semibold text-slate-700"}`}>
                        {session.userName || "Pengguna"}
                      </span>
                      <span className="text-[10px] text-slate-400 shrink-0">
                        {formatTime(session.lastMessageAt)}
                      </span>
                    </div>

                    <p className={`text-[11px] truncate ${hasUnread ? "font-bold text-emerald-700" : "text-slate-400"}`}>
                      {session.lastMessage || "Memulai percakapan"}
                    </p>
                  </div>
                </button>
              );
            })
          )}
        </div>
      </div>

      {/* RIGHT COLUMN: ACTIVE CHAT THREAD */}
      <div className="flex-1 flex flex-col bg-white">
        {selectedSession ? (
          <>
            {/* Header */}
            <div className="px-6 py-3.5 border-b border-slate-100 flex items-center justify-between bg-slate-50/30">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-xs">
                  {selectedSession.userName.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3 className="text-xs font-black text-slate-800">{selectedSession.userName}</h3>
                  <p className="text-[10px] text-slate-400">{selectedSession.userEmail || "Anggota Perpustakaan"}</p>
                </div>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-700 text-[10px] font-bold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Sesi Aktif
              </span>
            </div>

            {/* Messages Thread */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50/20">
              {messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center text-slate-400 py-12">
                  <Clock className="w-10 h-10 text-slate-300 mb-2" />
                  <p className="text-xs font-bold text-slate-600">Belum ada riwayat pesan</p>
                  <p className="text-[11px] text-slate-400">Kirim pesan balasan untuk menyapa anggota.</p>
                </div>
              ) : (
                messages.map(msg => {
                  const isAdmin = msg.senderRole === "admin";
                  return (
                    <div key={msg.id} className={`flex ${isAdmin ? "justify-end" : "justify-start"}`}>
                      <div className={`max-w-[70%] rounded-2xl px-4 py-2.5 shadow-xs ${
                        isAdmin
                          ? "bg-slate-900 text-white rounded-br-none"
                          : "bg-white border border-slate-200 text-slate-800 rounded-bl-none"
                      }`}>
                        <div className="flex items-center gap-2 mb-1">
                          <span className={`text-[10px] font-bold ${isAdmin ? "text-emerald-400" : "text-slate-500"}`}>
                            {msg.senderName}
                          </span>
                        </div>
                        <p className="text-xs leading-relaxed break-words">{msg.text}</p>
                        <div className="flex items-center justify-end gap-1 mt-1">
                          <span className={`text-[9px] ${isAdmin ? "text-slate-400" : "text-slate-400"}`}>
                            {formatTime(msg.timestamp)}
                          </span>
                          {isAdmin && <CheckCheck className="w-3 h-3 text-emerald-400" />}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
              <div ref={bottomRef} />
            </div>

            {/* Input Form */}
            <div className="p-4 border-t border-slate-100 bg-white flex items-end gap-2">
              <textarea
                value={replyInput}
                onChange={e => setReplyInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={`Balas pesan ke ${selectedSession.userName}...`}
                rows={1}
                className="flex-1 resize-none bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-xs text-slate-800 placeholder-slate-400 focus:bg-white focus:border-emerald-500 focus:outline-none transition-all"
                style={{ maxHeight: 100 }}
              />
              <button
                onClick={handleSendReply}
                disabled={!replyInput.trim() || isSending}
                className="px-4 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white rounded-2xl font-bold text-xs flex items-center gap-1.5 disabled:opacity-40 cursor-pointer active:scale-95 transition-all shadow-md shadow-emerald-600/20"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Kirim</span>
              </button>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-slate-400">
            <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mb-4">
              <MessageCircle className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="text-sm font-extrabold text-slate-700">Pilih Percakapan</h3>
            <p className="text-xs text-slate-400 max-w-xs mt-1">
              Klik salah satu sesi di sebelah kiri untuk melihat pesan dan membalas anggota.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
