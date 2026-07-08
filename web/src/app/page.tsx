import { getIngredientImages } from "@/sanity/queries";
import { IngredientImageCarousel } from "@/components/IngredientImageCarousel";
import { InteractiveTitle } from "@/components/InteractiveTitle";

export default async function Home() {
  const ingredientGroups = await getIngredientImages();

  return (
    <main className="min-h-screen bg-[#FFF3CD] py-8 text-center">
      <section className="mx-auto flex min-h-screen max-w-6xl flex-col items-center justify-center">
        <InteractiveTitle />
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
