import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useEffect, useState } from "react";
import { api } from "@/services/api";

export function Sidebar({ onSelect, selectedId }) {
  const [q, setQ] = useState("");
  const [contacts, setContacts] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const c = await api("/api/contacts/");
        setContacts(c);
      } catch {
        setContacts([]);
      }
    })();
  }, []);

  const filtered = contacts.filter(c => (c.username || "").toLowerCase().includes(q.toLowerCase()));

  return (
    <div className="h-full flex flex-col border-r bg-card/50">
      <div className="p-3">
        <Input placeholder="Search or start new chat" value={q} onChange={(e) => setQ(e.target.value)} />
      </div>
      <ScrollArea className="flex-1">
        <ul className="divide-y">
          {filtered.map(c => (
            <li key={c.id} className={`flex items-center gap-3 p-3 cursor-pointer ${selectedId===c.id?"bg-accent/20":"hover:bg-accent/10"}`} onClick={() => onSelect(c.id)}>
              <Avatar>
                <AvatarImage src={c.avatar_url || undefined} alt={`${c.username} avatar`} />
                <AvatarFallback>{(c.username || "").slice(0,2).toUpperCase()}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="font-medium">{c.username}</span>
                  {c.last_time && <span className="text-xs text-muted-foreground">{c.last_time}</span>}
                </div>
                <p className="text-sm text-muted-foreground line-clamp-1">{c.last_message || "No messages yet"}</p>
              </div>
            </li>
          ))}
        </ul>
      </ScrollArea>
    </div>
  );
}
