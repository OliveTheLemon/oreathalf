import MenuItem from "./MenuItem";
import SubMenuItem from "./SubMenuItem";

type HamburgerMenuProps = {
  onClose: () => void;
};

export default function HamburgerMenu({ onClose }: HamburgerMenuProps) {
  return (
    <>
      <div className="fixed top-0 left-0 z-50 h-full w-[400px] bg-amber-50 p-6 md:p-8">
        <button
          type="button"
          aria-label="메뉴 닫기"
          onClick={onClose}
          className="block text-4xl font-bold"
        >
          ×
        </button>
        <MenuItem title="Home" href="/" />
        <MenuItem title="Ingredient" href="/Ingredient" />
        <MenuItem title="About" href="/about" />
        <div className="block px-4 py-2 text-5xl font-bold text-neutral-500">
          Lab
        </div>
        <SubMenuItem title="whatiatetoday" href="/whatiatetoday" />
        <SubMenuItem title="random" href="/random" />
      </div>
      <button
        type="button"
        aria-label="메뉴 닫기"
        onClick={onClose}
        className="fixed inset-0 z-40 h-full w-full bg-gray-800/30"
      />
    </>
  );
}
