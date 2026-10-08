import Link from "next/link";

type SubMenuItemProps = {
  title: string;
  href: string;
};

export default function SubMenuItem({ title, href }: SubMenuItemProps) {
  return (
    <div className="group relative">
      <Link
        href={href}
        className="relative z-10 block px-8 py-2 text-4xl font-bold text-neutral-700 transition-colors duration-200 group-hover:text-neutral-50"
      >
        {title}
      </Link>
      <div className="pointer-events-none absolute top-3 left-4 z-0 h-[32px] w-[352px] bg-neutral-700 opacity-0 transition-opacity duration-200 group-hover:opacity-100"></div>
    </div>
  );
}
