"use client";

import { useState } from "react";
import type { IngredientImageGroup } from "@/sanity/queries";
import {
  IngredientFilterButton,
  IngredientImageGrid,
} from "@/components/ingredient/IngredientImageGrid+Button";

const filterCount = 4;

export function IngredientGallery({ group }: { group: IngredientImageGroup }) {
  const [filterIndex, setFilterIndex] = useState(0);
  const handleFilterClick = () => {
    setFilterIndex((currentIndex) => (currentIndex + 1) % filterCount);
  };

  return (
    <>
      <div className="fixed top-0 left-1/2 transform -translate-x-1/2 flex items-center justify-between h-[50px] md:h-[100px] z-50">
        <h1 className="text-2xl md:text-4xl font-bold">
          {group.ingredientName ?? "재료"}
        </h1>
      </div>

      <IngredientImageGrid group={group} filterIndex={filterIndex} />
      <div className="fixed bottom-6 right-6 z-30 flex h-14 w-14 items-center justify-center rounded-full bg-white shadow-lg">
        <IngredientFilterButton
          filterIndex={filterIndex}
          onClick={handleFilterClick}
        />
      </div>
    </>
  );
}
