import { getIngredientImages } from "@/sanity/queries";
import { IngredientImageCarousel } from "@/components/IngredientImageCarousel";
import { InteractiveTitle } from "@/components/InteractiveTitle";
import { InteractiveBigTitle } from "@/components/InteractiveBigTitle";

export default async function Home() {
  const ingredientGroups = await getIngredientImages();

  return (
    <main className="min-h-screen bg-[#FFF3CD]">
      {/* 상단 글귀 */}
      <section className="flex min-h-screen flex-col justify-center">
        <InteractiveTitle
          englishText={"Drink a lot of water"}
          koreanText={"물 많이 마시기"}
          alignment="right-third"
        />
        <InteractiveTitle
          englishText={"No breakfast"}
          koreanText={"아침 공복유지"}
          alignment="left-third"
        />
        <InteractiveTitle
          englishText={"Healthy lunch"}
          koreanText={"건강한 점심"}
          alignment="right-third"
        />
        <InteractiveTitle
          englishText={"No carbs dinner"}
          koreanText={"탄수화물 없는 저녁"}
          alignment="left-third"
        />
        <InteractiveBigTitle
          englishText={"or.....EAT HALF!"}
          koreanText={"아니면.....절반만 먹기!"}
        />
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
