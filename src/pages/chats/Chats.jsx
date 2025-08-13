import { useEffect, useState, useMemo } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { MessageList } from "@/components/chat/MessageList";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useWebSocket } from "@/hooks/useWebSocket";
import { ensureChatKey, encryptText, decryptText } from "@/lib/crypto";
import { useAuth } from "@/hooks/useAuth";
import { api } from "@/services/api";

const Chats = () => {
  const { user } = useAuth();
  const [activeChat, setActiveChat] = useState(null);
  const [text, setText] = useState("");
  const { connected, messages, send } = useWebSocket(activeChat || "", localStorage.getItem("access_token") || undefined);
  const [history, setHistory] = useState([]);

  useEffect(() => { document.title = "Chats — Chatter"; }, []);

  useEffect(() => {
    if (!activeChat) return;
    (async () => {
      try {
        const res = await api(`/api/chats/${activeChat}/messages/?limit=50`);
        const key = await ensureChatKey(activeChat);
        const decrypted = await Promise.all(
          (res.results || []).map(async (m) => ({
            id: m.id,
            from_self: m.sender_id === user?.id,
            text: await decryptText(key, m.cipher),
            status: m.status,
            created_at: m.created_at,
          }))
        );
        setHistory(decrypted);
      } catch {
        setHistory([]);
      }
    })();
  }, [activeChat, user?.id]);

  useEffect(() => {
    (async () => {
      if (!activeChat) return;
      const key = await ensureChatKey(activeChat);
      const newMsgs = await Promise.all(
        (messages || [])
          .filter(m => m.type === "message" && m.chat_id === activeChat)
          .map(async (m) => ({
            id: m.id,
            from_self: m.sender_id === user?.id,
            text: await decryptText(key, m.cipher),
            status: m.status,
            created_at: m.created_at,
          }))
      );
      if (newMsgs.length) setHistory(h => [...h, ...newMsgs]);
    })();
  }, [messages, activeChat, user?.id]);

  const canSend = useMemo(() => connected && activeChat && text.trim().length > 0, [connected, activeChat, text]);

  const onSend = async () => {
    if (!activeChat || !text.trim()) return;
    const key = await ensureChatKey(activeChat);
    const cipher = await encryptText(key, text.trim());
    send({ type: "message", chat_id: activeChat, cipher });
    setText("");
  };

  return (
    <div className="min-h-screen grid grid-cols-12">
      <div className="col-span-12 md:col-span-4 lg:col-span-3 border-r">
        <Sidebar onSelect={setActiveChat} selectedId={activeChat} />
      </div>
      <div className="col-span-12 md:col-span-8 lg:col-span-9 flex flex-col h-[calc(100vh-0px)]">
        <div className="h-16 border-b flex items-center px-4 justify-between">
          <div className="font-medium">{activeChat ? "Chat" : "Select a conversation"}</div>
          <div className="text-xs text-muted-foreground">{connected ? "Online" : "Offline"}</div>
        </div>
        <div className="flex-1 min-h-0">
          <MessageList messages={history} />
        </div>
        <div className="h-18 border-t p-3 flex items-center gap-2">
          <Input placeholder="Type a message" value={text} onChange={(e) => setText(e.target.value)} onKeyDown={(e) => { if (e.key==='Enter') onSend(); }} />
          <Button onClick={onSend} disabled={!canSend}>Send</Button>
        </div>
      </div>
    </div>
  );
};

export default Chats;
