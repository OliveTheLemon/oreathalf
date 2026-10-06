import type { Metadata } from "next";
import "./globals.css";
import Image from "next/image";

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
        <div className="fixed top-0 left-0 w-full z-40 h-[50px] md:h-[100px] backdrop-blur-sm flex items-center justify-between text-2xl md:text-4xl px-6 md:px-8">
          <div>
            <Image
              src="https://cdn.sanity.io/images/ph340op5/production/dc554eaff86fd3993639fe62f6f04de5900653ff-1882x687.png"
              alt="검정 로고 이미지"
              width={100}
              height={37}
              className="w-[54px] h-[20px] md:w-[100px] md:h-[37px] object-contain cursor-pointer"
            />
          </div>
          <div></div>
        </div>
        {children}
        <div className="pb-12"></div>
      </body>
    </html>
  );
}
