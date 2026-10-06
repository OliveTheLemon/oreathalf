"use client";

import Link from "next/link";
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
      <div className="flex items-center justify-between gap-4 h-[50px] md:h-[100px] z-70">
        <div className="w-16"></div>
        <h1 className="text-2xl font-bold">{group.ingredientName ?? "재료"}</h1>
        <div className="flex w-16 justify-end">
          <IngredientFilterButton
            filterIndex={filterIndex}
            onClick={handleFilterClick}
          />
        </div>
      </div>

      <IngredientImageGrid group={group} filterIndex={filterIndex} />
    </>
  );
}
