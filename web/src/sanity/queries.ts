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

// 같은 재료 번호를 가진 이미지들을 묶어서 하나의 그룹으로 관리하기 위한 타입입니다.
export type IngredientImageGroup = {
  ingredientId: string;
  ingredientNumber?: number;
  ingredientName?: string;
  images: SanityImageItem[];
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

  // 재료 번호 기준으로 정렬한 뒤, 같은 ingreNum을 가진 이미지끼리 묶어줍니다.
  const sortedImages = images.slice().sort((a, b) => {
    const aIngredientNumber = a.ingreNum?.ingreNum ?? Number.MAX_SAFE_INTEGER;
    const bIngredientNumber = b.ingreNum?.ingreNum ?? Number.MAX_SAFE_INTEGER;

    return aIngredientNumber - bIngredientNumber;
  });

  return sortedImages.reduce<IngredientImageGroup[]>((groups, image) => {
    const ingredientId = image.ingreNum?._id;

    if (!ingredientId) {
      return groups;
    }

    const existingGroup = groups.find(
      (group) => group.ingredientId === ingredientId,
    );

    if (existingGroup) {
      existingGroup.images.push(image);
      return groups;
    }

    groups.push({
      ingredientId,
      ingredientNumber: image.ingreNum?.ingreNum,
      ingredientName: image.ingreNum?.title,
      images: [image],
    });

    return groups;
  }, []);
}
