import {
  getImagesByIds,
  getIngredientImages,
  getPopupImage,
  type IngredientHoverImageSelection,
} from "@/sanity/queries";
import { HomePageContent } from "@/components/HomePageContent";

const carouselIngredientNumbers = [2, 3, 4, 5, 6, 17, 18, 19, 26];
const homeIngredientOrder = [
  2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22,
  23, 24, 25, 26,
];

const hoverImageSelections: IngredientHoverImageSelection[] = [
  {
    ingredientNumber: 7,
    imageIds: [
      "c06fb28f-c4db-4cc5-8248-9b1a6cbfcd6a",
      "08aWg16Pi4cEbiaMetWNTf",
    ],
  },
  {
    ingredientNumber: 8,
    imageIds: [
      "b8286157-5e5b-4486-acb6-23515eabadf3",
      "08aWg16Pi4cEbiaMetWR5N",
    ],
  },
  {
    ingredientNumber: 9,
    imageIds: [
      "dd76594c-8653-4179-bf16-5c549c51c52f",
      "08aWg16Pi4cEbiaMetWbQT",
    ],
  },
  {
    ingredientNumber: 10,
    imageIds: [
      "bec8ac13-c07e-4d93-893a-9f3401b63cbf",
      "08aWg16Pi4cEbiaMetWZ1X",
    ],
  },
  {
    ingredientNumber: 11,
    imageIds: [
      "af6e2805-3519-4ccb-a03e-2cfe0fc12b82",
      "08aWg16Pi4cEbiaMetWSsv",
    ],
  },
  {
    ingredientNumber: 12,
    imageIds: [
      "2ccfd663-f128-43fc-89bb-5e33c99c7a88",
      "KS9mk6zgdL7NuzcAATwbOI",
    ],
  },
  {
    ingredientNumber: 13,
    imageIds: [
      "e8338fb9-169d-46dd-9986-0d9f3c65b419",
      "KS9mk6zgdL7NuzcAATwcgE",
    ],
  },
  {
    ingredientNumber: 16,
    imageIds: [
      "6284125a-cb04-449b-950d-d9df553eb96f",
      "JXHQ78g5EpEijhO4J0R3fR",
    ],
  },
  {
    ingredientNumber: 22,
    imageIds: [
      "537f5625-9860-418b-9dfd-90e4d18b7fc6",
      "5808458e-204a-48fb-b377-c90556bcf127",
    ],
  },
  {
    ingredientNumber: 21,
    imageIds: [
      "3e2c5b86-2320-474d-8359-b14c7aaa1bcd",
      "3e2c5b86-2320-474d-8359-b14c7aaa1bcd",
    ],
  },
  {
    ingredientNumber: 14,
    imageIds: [
      "62eb9a72-f117-4a43-a4f6-f5026ce0b5d9",
      "7626f514-6ba9-4dc8-b257-07ef8475b988",
    ],
  },
  {
    ingredientNumber: 20,
    imageIds: [
      "90d6ba21-422b-4507-907d-7cb24f68dcb7",
      "90d6ba21-422b-4507-907d-7cb24f68dcb7",
    ],
  },
  {
    ingredientNumber: 15,
    imageIds: [
      "36da1b27-7830-4c8d-ba92-6ce5ad9674bd",
      "d16d6905-e7e7-40dc-a488-1311c59138b4",
    ],
  },
  {
    ingredientNumber: 23,
    imageIds: [
      "a94bc460-e793-45d8-a991-ec9545f85561",
      "c85e4b2f-ea7e-4a87-8266-1a6746cdee0b",
    ],
  },
  {
    ingredientNumber: 24,
    imageIds: [
      "71f76075-ad80-4650-b66c-63a395802530",
      "a4305452-509f-4c8c-9fa6-3af98c50f250",
    ],
  },
  {
    ingredientNumber: 25,
    imageIds: [
      "075a604b-d164-4840-bb33-c6ba4189716f",
      "1e25f017-6b41-4d49-8afd-591244c5aa13",
    ],
  },
];

export default async function Home() {
  const [ingredientGroups, popupImage, hoverImages] = await Promise.all([
    getIngredientImages(carouselIngredientNumbers),
    getPopupImage(),
    getImagesByIds(
      hoverImageSelections.flatMap((group) =>
        group.imageIds.filter((imageId): imageId is string => Boolean(imageId)),
      ),
    ),
  ]);
  const hoverGroups = hoverImageSelections.map((group) => ({
    ...group,
    images: group.imageIds
      .map((imageId) => hoverImages.find((image) => image._id === imageId))
      .filter((image) => image !== undefined),
  }));

  return (
    <HomePageContent
      ingredientGroups={ingredientGroups}
      popupImage={popupImage}
      hoverImageGroups={hoverGroups}
      ingredientOrder={homeIngredientOrder}
    />
  );
}
