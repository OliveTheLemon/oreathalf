import { getIngredientImages } from "@/sanity/queries";
import { HomePageContent } from "@/components/HomePageContent";

export default async function Home() {
  const ingredientGroups = await getIngredientImages();

  return <HomePageContent ingredientGroups={ingredientGroups} />;
}
