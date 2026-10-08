import Link from "next/link";

type SubMenuItemProps = {
  title: string;
  href: string;
  isHovered: boolean;
};

export default function SubMenuItem({
  title,
  href,
  isHovered,
}: SubMenuItemProps) {
  return (
    <div className="relative">
      <Link
        href={href}
        className={`block px-8 py-2 transition-colors duration-200 text-4xl font-bold text-neutral-500
          ${isHovered ? "bg-amber-200 text-amber-800" : "hover:bg-gray-200"}`}
      >
        {title}
      </Link>
      <div className="absolute block top-3 left-4 w-[352px] h-[32px] bg-neutral-700"></div>
    </div>
  );
}
