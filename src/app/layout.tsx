import type { Metadata } from "next";
import { AuthProvider } from "@/lib/auth-context";
import "./globals.css";

export const metadata: Metadata = {
  title: "FXMM — AI Forex Report Engine",
  description: "Automated daily FX analysis reports",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
