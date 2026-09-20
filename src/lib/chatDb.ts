/**
 * chatDb.ts
 * Layer data untuk Live Chat User <-> Admin.
 * - Jika Supabase terkonfigurasi: gunakan tabel chat_messages + Realtime
 * - Fallback: localStorage dengan struktur JSON
 */

import { supabase, isSupabaseConfigured } from './supabase';
import { ChatMessage, ChatSession } from '../types';

const LS_MESSAGES_KEY = 'live_chat_messages';
const LS_SESSIONS_KEY = 'live_chat_sessions';

function lsGetMessages(): ChatMessage[] {
  try {
    const raw = localStorage.getItem(LS_MESSAGES_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

function lsSaveMessages(msgs: ChatMessage[]) {
  localStorage.setItem(LS_MESSAGES_KEY, JSON.stringify(msgs));
}

function lsGetSessions(): ChatSession[] {
  try {
    const raw = localStorage.getItem(LS_SESSIONS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

function lsSaveSessions(sessions: ChatSession[]) {
  localStorage.setItem(LS_SESSIONS_KEY, JSON.stringify(sessions));
}

export async function sendChatMessage(
  msg: Omit<ChatMessage, 'id' | 'timestamp' | 'isRead'>
): Promise<ChatMessage> {
  const newMsg: ChatMessage = {
    ...msg,
    id: `msg_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    timestamp: new Date().toISOString(),
    isRead: false,
  };

  if (isSupabaseConfigured) {
    try {
      await supabase.from('chat_messages').insert({
        id: newMsg.id,
        session_id: newMsg.sessionId,
        sender_id: newMsg.senderId,
        sender_name: newMsg.senderName,
        sender_role: newMsg.senderRole,
        text: newMsg.text,
        timestamp: newMsg.timestamp,
        is_read: false,
      });
    } catch (e) {
      console.warn('Supabase chat insert failed, using localStorage fallback:', e);
    }
  }

  const msgs = lsGetMessages();
  msgs.push(newMsg);
  lsSaveMessages(msgs);

  const sessions = lsGetSessions();
  const sessionIdx = sessions.findIndex(s => s.id === msg.sessionId);
  if (sessionIdx >= 0) {
    const s = sessions[sessionIdx];
    sessions[sessionIdx] = {
      ...s,
      lastMessage: newMsg.text,
      lastMessageAt: newMsg.timestamp,
      unreadByAdmin: msg.senderRole === 'user' ? s.unreadByAdmin + 1 : s.unreadByAdmin,
      unreadByUser: msg.senderRole === 'admin' ? s.unreadByUser + 1 : s.unreadByUser,
    };
  } else {
    sessions.push({
      id: msg.sessionId,
      userId: msg.sessionId,
      userName: msg.senderName,
      userEmail: '',
      lastMessage: newMsg.text,
      lastMessageAt: newMsg.timestamp,
      unreadByAdmin: msg.senderRole === 'user' ? 1 : 0,
      unreadByUser: msg.senderRole === 'admin' ? 1 : 0,
      isActive: true,
    });
  }
  lsSaveSessions(sessions);

  return newMsg;
}

export async function getChatMessages(sessionId: string): Promise<ChatMessage[]> {
  if (isSupabaseConfigured) {
    try {
      const { data, error } = await supabase
        .from('chat_messages')
        .select('*')
        .eq('session_id', sessionId)
        .order('timestamp', { ascending: true });
      if (!error && data) {
        return data.map((row: any) => ({
          id: row.id,
          sessionId: row.session_id,
          senderId: row.sender_id,
          senderName: row.sender_name,
          senderRole: row.sender_role,
          text: row.text,
          timestamp: row.timestamp,
          isRead: row.is_read,
        }));
      }
    } catch (e) {
      console.warn('Supabase chat fetch failed:', e);
    }
  }
  return lsGetMessages().filter(m => m.sessionId === sessionId);
}

export async function getAllChatSessions(): Promise<ChatSession[]> {
  const sessions = lsGetSessions();
  return sessions.sort(
    (a, b) => new Date(b.lastMessageAt).getTime() - new Date(a.lastMessageAt).getTime()
  );
}

export async function markSessionReadByAdmin(sessionId: string): Promise<void> {
  const sessions = lsGetSessions();
  const idx = sessions.findIndex(s => s.id === sessionId);
  if (idx >= 0) {
    sessions[idx].unreadByAdmin = 0;
    lsSaveSessions(sessions);
  }
}

export async function markSessionReadByUser(sessionId: string): Promise<void> {
  const sessions = lsGetSessions();
  const idx = sessions.findIndex(s => s.id === sessionId);
  if (idx >= 0) {
    sessions[idx].unreadByUser = 0;
    lsSaveSessions(sessions);
  }
}

export function upsertChatSession(session: Partial<ChatSession> & { id: string; userId: string; userName: string; userEmail: string }) {
  const sessions = lsGetSessions();
  const idx = sessions.findIndex(s => s.id === session.id);
  if (idx >= 0) {
    sessions[idx] = { ...sessions[idx], ...session };
  } else {
    sessions.push({
      lastMessage: '',
      lastMessageAt: new Date().toISOString(),
      unreadByAdmin: 0,
      unreadByUser: 0,
      isActive: true,
      ...session,
    });
  }
  lsSaveSessions(sessions);
}

export function subscribeChatMessages(
  sessionId: string,
  onMessage: (msg: ChatMessage) => void
): () => void {
  if (!isSupabaseConfigured) return () => {};
  const channel = supabase
    .channel(`chat_${sessionId}`)
    .on('postgres_changes' as any, {
      event: 'INSERT',
      schema: 'public',
      table: 'chat_messages',
      filter: `session_id=eq.${sessionId}`,
    }, (payload: any) => {
      const row = payload.new;
      onMessage({
        id: row.id,
        sessionId: row.session_id,
        senderId: row.sender_id,
        senderName: row.sender_name,
        senderRole: row.sender_role,
        text: row.text,
        timestamp: row.timestamp,
        isRead: row.is_read,
      });
    })
    .subscribe();

  return () => { supabase.removeChannel(channel); };
}
