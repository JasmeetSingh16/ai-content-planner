import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import "../styles/jaseir-kit.css";
import SiteHeader from "../components/layout/SiteHeader";
import SiteFooter from "../components/layout/SiteFooter";
import { agentMetadata } from "../lib/agent-metadata";
import type { SiteZone } from "../lib/site";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = agentMetadata("content-planner");

const zone: SiteZone = { kind: "agent", slug: "content-planner" };

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <SiteHeader zone={zone} />
        {children}
        <SiteFooter
          zone={zone}
          cta={{
            title: "Want a content engine, not just a calendar?",
            text: "We train the planner on your brand guide, connect it to your scheduler and have a new week drafted for approval every Friday.",
          }}
        />
      </body>
    </html>
  );
}
