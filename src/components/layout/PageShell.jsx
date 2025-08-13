import { cn } from "@/lib/utils";

export function PageShell({ children }) {
  return (
    <div className={cn("min-h-screen")}>
      {children}
    </div>
  );
}
