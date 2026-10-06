import { notFound } from "next/navigation";
import { IngredientDetailContent } from "@/components/ingredient/IngredientDetailContent";
import { IngredientGallery } from "../../../components/ingredient/IngredientGallery";
import { getIngredientGroupById } from "@/sanity/queries";

export default async function IngredientPage({
  params,
}: {
  params: Promise<{ ingredientNumber: string }>;
}) {
  const { ingredientNumber } = await params;
  const group = await getIngredientGroupById(ingredientNumber);

  if (!group) {
    notFound();
  }

  return (
    // 재료 이름이 커서를 따라다니도록 공통 래퍼로 감싸서 렌더링합니다.
    <IngredientDetailContent ingredientName={group.ingredientName ?? "재료"}>
      <main className="min-h-screen bg-background text-center sunflower-bold">
        <div className="flex w-full flex-col gap-8">
          <IngredientGallery group={group} />
        </div>
      </main>
    </IngredientDetailContent>
  );
}
