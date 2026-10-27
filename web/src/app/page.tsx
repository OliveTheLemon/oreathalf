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
      "e2e9480c-57da-4370-bceb-dbaec4808956",
      "jQWf2sxFjrM4OgCYcaHdMV",
    ],
  },
  {
    ingredientNumber: 21,
    imageIds: ["gTHDDQd2Spc0QHfHShnv9A", "cO5UITnAMNJhRlGSJ4DRKl"],
  },
  {
    ingredientNumber: 14,
    imageIds: [
      "jQWf2sxFjrM4OgCYcaI5oA",
      "97a06795-0de5-40d8-8c96-1273bc2c81bd",
    ],
  },
  {
    ingredientNumber: 20,
    imageIds: ["jQWf2sxFjrM4OgCYcaI0xH", "jQWf2sxFjrM4OgCYcaHer5"],
  },
  {
    ingredientNumber: 15,
    imageIds: [
      "cO5UITnAMNJhRlGSJ4DM9L",
      "d16d6905-e7e7-40dc-a488-1311c59138b4",
    ],
  },
  {
    ingredientNumber: 23,
    imageIds: [
      "jQWf2sxFjrM4OgCYcaHyn2",
      "f7bedd11-4812-4c22-9191-740b96a48c6e",
    ],
  },
  {
    ingredientNumber: 24,
    imageIds: [
      "gTHDDQd2Spc0QHfHShnyGh",
      "d78ae306-3f1c-4733-aef7-c15b356fca79",
    ],
  },
  {
    ingredientNumber: 25,
    imageIds: ["gTHDDQd2Spc0QHfHShngrx", "jQWf2sxFjrM4OgCYcaHSuR"],
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
