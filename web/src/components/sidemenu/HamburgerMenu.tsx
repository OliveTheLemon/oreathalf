import MenuItem from "./MenuItem";
import SubMenuItem from "./SubMenuItem";

export default function HamburgerMenu() {
  return (
    <>
      <div className="fixed top-0 left-0 w-[400px] h-full bg-amber-50 z-40 p-6 md:p-8">
        <div className="block text-3xl font-bold">×</div>
        <MenuItem title="Home" href="/" isHovered={false} />
        <MenuItem title="Ingredient" href="/Ingredient" isHovered={false} />
        <MenuItem title="About" href="/about" isHovered={false} />
        <div className="block px-4 py-2 text-5xl font-bold text-neutral-500">
          Lab
        </div>
        <SubMenuItem
          title="whatiatetoday"
          href="/whatiatetoday"
          isHovered={false}
        />
        <SubMenuItem title="random" href="/random" isHovered={false} />
      </div>
      <div className="fixed top-0 left-0 w-full h-full bg-gray-800/30 z-30"></div>
    </>
  );
}
