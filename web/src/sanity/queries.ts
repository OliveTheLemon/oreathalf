import { client } from "./client";

export type SanityImageItem = {
  _id: string;
  title: string;
  istgUrl?: string;
  ingreNum?: {
    _id: string;
    name?: string;
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

function sortIngredientImages(images: SanityImageItem[]) {
  return images.slice().sort((a, b) => {
    const aIngredientNumber = a.ingreNum?.ingreNum ?? Number.MAX_SAFE_INTEGER;
    const bIngredientNumber = b.ingreNum?.ingreNum ?? Number.MAX_SAFE_INTEGER;

    return aIngredientNumber - bIngredientNumber;
  });
}

function buildIngredientGroups(images: SanityImageItem[]) {
  return sortIngredientImages(images).reduce<IngredientImageGroup[]>(
    (groups, image) => {
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
        ingredientName: image.ingreNum?.name,
        images: [image],
      });

      return groups;
    },
    [],
  );
}

// 메인 페이지에서 재료별 이미지 그룹 불러옴
export async function getIngredientImages() {
  const images = await client.fetch<SanityImageItem[]>(
    `*[_type == "ingrePhotograph" && category == 0]{
    _id,
    title,
    ingreNum->{_id, name, ingreNum},
    image{
      asset->{url},
      alt
    }
  }`,
    // 이미지 캐시 설정 - sanity 업데이트 적용 안 될때 사용
    // {},
    // { cache: "no-store" },
  );

  return buildIngredientGroups(images);
}

export async function getPopupImage() {
  return await client.fetch<SanityImageItem | null>(
    `*[_type == "ingrePhotograph" && category == 2 && ingreNum->ingreNum == 0][0]{
      _id,
      title,
      ingreNum->{_id, name, ingreNum},
      image{
        asset->{url},
        alt
      }
    }`,
    {},
    { cache: "no-store" },
  );
}

// 각 재료 상세페이지 이동할 때,
export async function getIngredientGroupById(
  ingredientNumber: string | number,
) {
  const normalizedIngredientNumber = Number(ingredientNumber);

  const images = await client.fetch<SanityImageItem[]>(
    `*[_type == "ingrePhotograph" && ingreNum->ingreNum == $ingredientNumber]{
      _id,
      title,
      istgUrl,
      ingreNum->{_id, name, ingreNum},
      image{
        asset->{url},
        alt
      }
    }`,
    { ingredientNumber: normalizedIngredientNumber },
    { cache: "no-store" },
  );

  const groups = buildIngredientGroups(images);

  return groups[0] ?? null;
}
