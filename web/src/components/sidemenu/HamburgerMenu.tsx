"use client";

import { useRouter } from "next/navigation";
import MenuItem from "./MenuItem";
import SubMenuItem from "./SubMenuItem";
import type { MouseEvent } from "react";

type HamburgerMenuProps = {
  isOpen: boolean;
  onClose: () => void;
};

export default function HamburgerMenu({ isOpen, onClose }: HamburgerMenuProps) {
  const router = useRouter();

  const navigateToRandomIngredient = (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    const ingredientNumber = Math.floor(Math.random() * 25) + 2;
    router.push(`/ingredient/${ingredientNumber}`);
    onClose();
  };

  const closeMenu = () => onClose();

  return (
    <>
      <div
        aria-hidden={!isOpen}
        className={`fixed top-0 left-0 z-50 h-full w-[400px] bg-amber-50 p-6 transition-transform duration-500 ease-in-out md:p-8 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <button
          type="button"
          aria-label="메뉴 닫기"
          onClick={onClose}
          className="block text-4xl font-bold"
        >
          ×
        </button>
        <MenuItem title="Home" href="/" onSelect={closeMenu} />
        <MenuItem
          title="Ingredient"
          href="/ingredient/2"
          onSelect={navigateToRandomIngredient}
        />
        <MenuItem title="About" href="/about" onSelect={closeMenu} />
        <div className="block px-4 py-2 text-5xl font-bold text-neutral-500">
          Lab
        </div>
        <SubMenuItem
          title="whatiatetoday"
          href="/whatiatetoday"
          onSelect={closeMenu}
        />
        <SubMenuItem title="random" href="/random" onSelect={closeMenu} />
      </div>
      <button
        type="button"
        aria-label="메뉴 닫기"
        onClick={onClose}
        aria-hidden={!isOpen}
        tabIndex={isOpen ? 0 : -1}
        className={`fixed inset-0 z-40 h-full w-full bg-gray-800/30 transition-opacity duration-500 ease-in-out ${
          isOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />
    </>
  );
}
