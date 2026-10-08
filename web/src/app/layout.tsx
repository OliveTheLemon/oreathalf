import type { Metadata } from "next";
import "./globals.css";
import SideMenuController from "@/components/sidemenu/SideMenuController";

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
  ),
  title: "oreathalf",
  description: "mz undefined project",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body>
        <SideMenuController />
        {children}
        <div className="pb-12"></div>
      </body>
    </html>
  );
}
