import { useEffect, useRef, useState } from "react";
import { WS_BASE } from "@/config";

export function useWebSocket(chatId, token) {
  const [connected, setConnected] = useState(false);
  const [messages, setMessages] = useState([]);
  const wsRef = useRef(null);

  useEffect(() => {
    if (!chatId) return;
    const url = `${WS_BASE}/ws/chat/${chatId}/?token=${encodeURIComponent(token || "")}`;
    const ws = new WebSocket(url);
    wsRef.current = ws;
    ws.onopen = () => setConnected(true);
    ws.onclose = () => setConnected(false);
    ws.onmessage = (ev) => {
      try {
        const data = JSON.parse(ev.data);
        setMessages((m) => [...m, data]);
      } catch {}
    };
    return () => ws.close();
  }, [chatId, token]);

  const send = (msg) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(msg));
    }
  };

  return { connected, messages, send };
}
