import Image from "next/image";
import { getIngredientImages } from "@/sanity/queries";

// Sanity 이미지 URL에 브라우저 화면 크기에 맞는 너비를 붙여서
// 더 작은 이미지로 빠르게 로딩되도록 변환하는 헬퍼 함수
function getSanityImageSrc(url: string | undefined, width: number) {
  if (!url) {
    return "";
  }

  const separator = url.includes("?") ? "&" : "?";
  return `${url}${separator}auto=format&fit=max&w=${width}`;
}

export default async function Home() {
  const uniqueImages = await getIngredientImages();

  return (
    <main className="min-h-screen bg-[#FFF3CD] py-8 text-center">
      <section className="mx-auto flex min-h-screen max-w-6xl flex-col items-center justify-center">
        <h1 className="text-3xl font-semibold text-[#1f1f1f] md:text-6xl">
          ox.....EXX HXXX!
        </h1>
      </section>

      <section className="mx-auto">
        <div className="grid w-full grid-cols-2 sm:grid-cols-3 lg:grid-cols-5">
          {uniqueImages.map((image) => {
            const imageUrl = image.image?.asset?.url;
            const altText = image.image?.alt || image.title || "재료 이미지";
            const optimizedImageUrl = getSanityImageSrc(imageUrl, 800);

            if (!optimizedImageUrl) {
              return null;
            }

            return (
              // Next/Image를 사용해 이미지 최적화, lazy loading, 반응형 크기 조절을 자동으로 처리합니다.
              <div
                key={image._id}
                className="relative aspect-[9/16] w-full sm:aspect-[9/8] md:aspect-[9/8] lg:aspect-[9/8]"
              >
                <Image
                  src={optimizedImageUrl}
                  alt={altText}
                  fill
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                  loading="lazy"
                  className="object-cover"
                />
              </div>
            );
          })}
        </div>
      </section>
    </main>
  );
}
