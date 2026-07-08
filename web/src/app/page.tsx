import { getIngredientImages } from "@/sanity/queries";
import { IngredientImageCarousel } from "@/components/IngredientImageCarousel";

export default async function Home() {
  // Sanity에서 재료별 이미지 그룹을 가져와서 각 칸에 렌더링합니다.
  const ingredientGroups = await getIngredientImages();

  return (
    <main className="min-h-screen bg-[#FFF3CD] py-8 text-center">
      <section className="mx-auto flex min-h-screen max-w-6xl flex-col items-center justify-center">
        <h1 className="text-3xl font-semibold text-[#1f1f1f] md:text-6xl">
          ox.....EXX HXXX!
        </h1>
      </section>

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
