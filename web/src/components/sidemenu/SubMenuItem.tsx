import Link from "next/link";
import type { MouseEvent } from "react";

type SubMenuItemProps = {
  title: string;
  href: string;
  onSelect: (event: MouseEvent<HTMLAnchorElement>) => void;
};

export default function SubMenuItem({ title, href, onSelect }: SubMenuItemProps) {
  return (
    <div className="group relative">
      <Link
        href={href}
        onClick={onSelect}
        className="relative z-10 block px-8 py-2 text-4xl font-bold text-neutral-500 transition-colors duration-200 group-hover:text-neutral-100"
      >
        {title}
      </Link>
      <div className="pointer-events-none absolute top-3 left-4 z-0 h-[32px] w-[352px] bg-neutral-700 opacity-0 transition-opacity duration-200 group-hover:opacity-100"></div>
    </div>
  );
}
