import Link from "next/link";

type MenuItemProps = {
  title: string;
  href: string;
  isHovered: boolean;
};

export default function MenuItem({ title, href, isHovered }: MenuItemProps) {
  return (
    <div className="relative">
      <Link
        href={href}
        className={`block px-4 py-2 transition-colors duration-200 text-6xl font-bold
          ${isHovered ? "bg-amber-200 text-amber-800" : "hover:bg-gray-200"}`}
      >
        {title}
      </Link>
      <div className="absolute block top-3 -left-6 md:-left-8 w-[400px] h-[50px] bg-neutral-700"></div>
    </div>
  );
}
