"use client";

import Image from "next/image";
import { useState } from "react";
import HamburgerMenu from "./HamburgerMenu";

export default function SideMenuController() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <div className="fixed top-0 left-0 z-40 flex h-[50px] w-full items-center justify-between px-6 text-2xl backdrop-blur-sm md:h-[100px] md:px-8 md:text-4xl">
        <button
          type="button"
          aria-label="메뉴 열기"
          aria-expanded={isOpen}
          onClick={() => setIsOpen(true)}
        >
          <Image
            src="https://cdn.sanity.io/images/ph340op5/production/dc554eaff86fd3993639fe62f6f04de5900653ff-1882x687.png"
            alt="검정 로고 이미지"
            width={100}
            height={37}
            className="h-[20px] w-[54px] cursor-pointer object-contain md:h-[37px] md:w-[100px]"
          />
        </button>
      </div>
      <HamburgerMenu
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
      />
    </>
  );
}
