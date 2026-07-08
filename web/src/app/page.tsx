import { getIngredientImages } from "@/sanity/queries";
import { IngredientImageCarousel } from "@/components/IngredientImageCarousel";
import { InteractiveTitle } from "@/components/InteractiveTitle";

export default async function Home() {
  const ingredientGroups = await getIngredientImages();

  return (
    <main className="min-h-screen bg-[#FFF3CD] text-center">
      {/* 상단 글귀 */}
      <section className="mx-auto flex min-h-screen max-w-6xl flex-col items-center justify-center">
        <InteractiveTitle />
      </section>

      {/* 하단 이미지 그리드 */}
      <section className="mx-auto">
        <div className="grid w-full grid-cols-2 sm:grid-cols-3 lg:grid-cols-5">
          {ingredientGroups.map((group) => (
            <IngredientImageCarousel key={group.ingredientId} group={group} />
          ))}
        </div>
      </section>
    </main>
  );
}
