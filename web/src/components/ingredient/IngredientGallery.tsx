"use client";

import { useState } from "react";
import type { IngredientImageGroup } from "@/sanity/queries";
import {
  IngredientFilterButton,
  IngredientImageGrid,
} from "@/components/ingredient/IngredientImageGrid+Button";

export function IngredientGallery({ group }: { group: IngredientImageGroup }) {
  const [filterIndex, setFilterIndex] = useState(0);

  return (
    <>
      <div className="fixed top-0 left-1/2 transform -translate-x-1/2 flex items-center justify-between h-[50px] md:h-[100px] z-50">
        <h1 className="text-2xl md:text-4xl font-bold">
          {group.ingredientName ?? "재료"}
        </h1>
      </div>

      <IngredientImageGrid group={group} filterIndex={filterIndex} />
      <IngredientFilterButton
        filterIndex={filterIndex}
        onSelect={setFilterIndex}
      />
    </>
  );
}
