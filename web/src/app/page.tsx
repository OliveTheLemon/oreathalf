import { getIngredientImages, getPopupImage } from "@/sanity/queries";
import { HomePageContent } from "@/components/HomePageContent";

export default async function Home() {
  const ingredientGroups = await getIngredientImages();
  const popupImage = await getPopupImage();

  return (
    <HomePageContent
      ingredientGroups={ingredientGroups}
      popupImage={popupImage}
    />
  );
}
