import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from '@clerk/nextjs';
import { ModelProvider } from "@/providers/model-provider";
import { ToastProvider } from "@/providers/toast-provider";
import ThemeToggleButton from "@/components/themetogglebutton";

const inter = Inter({ subsets: ["latin"], weight: ["100","200","300","400","500","600","700","800","900"] });

export const metadata: Metadata = {
  title: "Admin Dashboard",
  description: "Manage your store efficiently!",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={inter.className}>
          <ModelProvider />
          <ToastProvider />
          <div className="flex flex-col min-h-screen">
            <main className="flex-grow">
              {children}
            </main>
          </div>
        </body>
      </html>
    </ClerkProvider>
  );
}
