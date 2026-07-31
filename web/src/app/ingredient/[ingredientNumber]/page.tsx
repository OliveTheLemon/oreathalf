import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getIngredientGroupById } from "@/sanity/queries";

function getSanityImageSrc(url: string | undefined, width: number) {
  if (!url) {
    return "";
  }

  const separator = url.includes("?") ? "&" : "?";
  return `${url}${separator}auto=format&fit=max&w=${width}`;
}

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
    <main className="min-h-screen bg-background px-4 py-12 text-center text-[#3A2D1E]">
      <div className="mx-auto flex max-w-6xl flex-col gap-8">
        <div className="flex items-center justify-between gap-4">
          <Link href="/" className="text-sm font-semibold underline">
            ← 홈으로
          </Link>
          <h1 className="text-2xl font-bold">
            {group.ingredientName ?? "재료오 이미지"}
          </h1>
          <div className="w-16" />
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {group.images.map((imageItem) => {
            const imageUrl = imageItem.image?.asset?.url;
            const optimizedUrl = getSanityImageSrc(imageUrl, 800);
            const altText =
              imageItem.image?.alt || imageItem.title || "재료 이미지";

            return (
              <div
                key={imageItem._id}
                className="overflow-hidden rounded-xl bg-white shadow-sm"
              >
                <div className="relative aspect-[9/16] w-full">
                  {optimizedUrl ? (
                    <Image
                      src={optimizedUrl}
                      alt={altText}
                      fill
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                      className="object-cover"
                    />
                  ) : null}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </main>
  );
}
