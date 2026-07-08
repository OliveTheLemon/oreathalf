import { client } from "./client";

export type SanityImageItem = {
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

export async function getIngredientImages() {
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

  return images
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
}
