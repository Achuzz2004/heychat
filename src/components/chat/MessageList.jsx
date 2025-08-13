import { ScrollArea } from "@/components/ui/scroll-area";
import { useEffect, useRef } from "react";

export function MessageList({ messages }) {
  const endRef = useRef(null);
  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages?.length]);
  return (
    <ScrollArea className="h-full">
      <div className="p-4 space-y-2">
        {(messages || []).map(m => (
          <div key={m.id} className={`max-w-[75%] ${m.from_self?"ml-auto bg-primary text-primary-foreground":"mr-auto bg-secondary"} px-3 py-2 rounded-lg shadow-soft`}>
            <p className="whitespace-pre-wrap text-sm">{m.text}</p>
            <div className="flex items-center justify-end gap-2 mt-1 opacity-75 text-[10px]">
              <span>{new Date(m.created_at).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}</span>
              {m.from_self && <span>{m.status}</span>}
            </div>
          </div>
        ))}
        <div ref={endRef} />
      </div>
    </ScrollArea>
  );
}
