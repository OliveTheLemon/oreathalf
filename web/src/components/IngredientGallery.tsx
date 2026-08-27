"use client";

import Link from "next/link";
import { useState } from "react";
import type { IngredientImageGroup } from "@/sanity/queries";
import {
  IngredientFilterButton,
  IngredientImageGrid,
} from "@/components/IngredientImageGrid+Button";

const filterCount = 4;

export function IngredientGallery({ group }: { group: IngredientImageGroup }) {
  const [filterIndex, setFilterIndex] = useState(0);
  const handleFilterClick = () => {
    setFilterIndex((currentIndex) => (currentIndex + 1) % filterCount);
  };

  return (
    <>
      <div className="grid grid-cols-[4rem_minmax(0,1fr)_4rem] items-center gap-4">
        <Link href="/" className="text-left text-sm font-semibold underline">
          ← 홈으로
        </Link>
        <h1 className="truncate text-center text-2xl font-bold">
          {group.ingredientName ?? "재료"}
        </h1>
        <div className="flex justify-end">
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
