import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";
import ConvexClientProvider from "@/components/ConvexClientProvider";
import { SiteHeader } from "@/components/SiteHeader";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "TrolleyWise — shop the cheaper store",
  description:
    "Tell me where to shop this week. Compare your grocery trolley across Coles, Woolworths, and Aldi and save on every shop.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en" className={`${geistSans.variable} h-full antialiased`}>
        <body className="min-h-full flex flex-col bg-slate-50 text-slate-900">
          <ConvexClientProvider>
            <SiteHeader />
            <main className="flex-1">{children}</main>
          </ConvexClientProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
