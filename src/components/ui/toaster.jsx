import React from "react";
import { useToast } from "@/hooks/use-toast.jsx" // Adjust the import path
import {
  ToastProvider as RadixToastProvider,
  Toast as RadixToast,
  ToastTitle,
  ToastDescription,
  ToastClose,
  ToastViewport,
} from "@/components/ui/toast"; // Or wherever your Radix Toast components are

export function Toaster() {
  const { toasts, removeToast } = useToast();

  return (
    <RadixToastProvider>
      {toasts.map(({ id, title, description, action }) => (
        <RadixToast
          key={id}
          onOpenChange={(open) => {
            if (!open) removeToast(id);
          }}
        >
          <div className="grid gap-1">
            {title && <ToastTitle>{title}</ToastTitle>}
            {description && <ToastDescription>{description}</ToastDescription>}
          </div>
          {action}
          <ToastClose />
        </RadixToast>
      ))}
      <ToastViewport />
    </RadixToastProvider>
  );
}
