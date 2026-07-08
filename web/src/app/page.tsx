import { client } from "@/sanity/client";

type SanityImageItem = {
  _id: string;
  title: string;
  ingreNum?: {
    _id: string;
    title?: string;
    ingreNum?: number;
  };
  image?: {
    asset?: {
      url?: string;
    };
    alt?: string;
  };
};

export default async function Home() {
  const images = await client.fetch<
    SanityImageItem[]
  >(`*[_type == "ingrePhotograph" && category == 0]{
    _id,
    title,
    ingreNum->{_id, title, ingreNum},
    image{
      asset->{url},
      alt
    }
  }`);

  const uniqueImages = images
    .slice()
    .sort((a, b) => {
      const aIngredientNumber = a.ingreNum?.ingreNum ?? Number.MAX_SAFE_INTEGER;
      const bIngredientNumber = b.ingreNum?.ingreNum ?? Number.MAX_SAFE_INTEGER;

      return aIngredientNumber - bIngredientNumber;
    })
    .filter((image, index, array) => {
      const ingredientId = image.ingreNum?._id;

      if (!ingredientId) {
        return true;
      }

      return (
        index === array.findIndex((item) => item.ingreNum?._id === ingredientId)
      );
    });

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

            if (!imageUrl) {
              return null;
            }

            return (
              <img
                key={image._id}
                src={imageUrl}
                alt={altText}
                loading="lazy"
                className="w-full object-cover aspect-[9/16] sm:aspect-[9/8] md:aspect-[9/8] lg:aspect-[9/8]"
              />
            );
          })}
        </div>
      </section>
    </main>
  );
}
