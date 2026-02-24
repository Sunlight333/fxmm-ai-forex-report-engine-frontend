"use client";

import { Toaster } from "react-hot-toast";

export function ToastProvider() {
  return (
    <Toaster
      position="top-right"
      toastOptions={{
        duration: 4000,
        style: {
          background: "#252538",
          color: "#E0E0E0",
          border: "1px solid #2A2A3E",
          borderRadius: "0.5rem",
          fontSize: "0.875rem",
        },
        success: {
          iconTheme: { primary: "#4CAF50", secondary: "#252538" },
        },
        error: {
          iconTheme: { primary: "#EF5350", secondary: "#252538" },
          duration: 5000,
        },
      }}
    />
  );
}
