import * as Sentry from "@sentry/nextjs";
import type { Metadata } from "next";
import "./globals.css";
import SideMenuController from "@/components/sidemenu/SideMenuController";
import { Analytics } from "@vercel/analytics/next";

export function generateMetadata(): Metadata {
  return {
    metadataBase: new URL(
      process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
    ),
    title: "oreathalf",
    description: "mz undefined project",
    other: {
      ...Sentry.getTraceData(),
    },
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body>
        <Analytics />
        <SideMenuController />
        {children}
        {/* <div className="pb-12"></div> */}
      </body>
    </html>
  );
}
