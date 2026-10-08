import Link from "next/link";

type MenuItemProps = {
  title: string;
  href: string;
  onSelect: () => void;
};

export default function MenuItem({ title, href, onSelect }: MenuItemProps) {
  return (
    <div className="group relative">
      <Link
        href={href}
        onClick={onSelect}
        className="relative z-10 block px-4 py-2 text-6xl font-bold text-neutral-900 transition-colors duration-400 group-hover:text-white group-hover:mix-blend-difference"
      >
        {title}
      </Link>
      <div className="pointer-events-none absolute top-3 -left-6 z-0 h-[50px] w-[400px] bg-neutral-700 opacity-0 transition-opacity duration-200 group-hover:opacity-100 md:-left-8"></div>
    </div>
  );
}
