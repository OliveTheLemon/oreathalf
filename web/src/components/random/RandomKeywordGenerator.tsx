"use client";

import { useState } from "react";
import { KeywordSetting } from "@/components/random/KeywordSetting";
import { TitleKeywordOutput } from "@/components/random/TitleKeywordOutput";

export interface KeywordSubgroup {
  title: string;
  keywords: string[];
}

export interface KeywordGroup {
  title: string;
  keywords: string[];
  subgroups: KeywordSubgroup[];
}

export interface KeywordCategory {
  groups: KeywordGroup[];
}

export interface KeywordGroups {
  noun: KeywordCategory;
  verbAdjectiveAdverb: KeywordCategory;
  style: KeywordCategory;
  purpose: KeywordCategory;
}

export type KeywordKey = keyof KeywordGroups;
export type SelectableKeywordKey = Exclude<KeywordKey, "purpose">;
export type KeywordSelection = Record<
  SelectableKeywordKey,
  Array<{ enabled: boolean; subgroups: boolean[] }>
>;

interface RandomKeywordGeneratorProps {
  keywords: KeywordGroups;
}

const outputs: Array<{
  key: KeywordKey;
  title: string;
  placeholder: string;
}> = [
  { key: "noun", title: "명사", placeholder: "명사 키워드" },
  {
    key: "verbAdjectiveAdverb",
    title: "동사·형용사·부사",
    placeholder: "동사·형용사·부사 키워드",
  },
  { key: "style", title: "스타일", placeholder: "스타일 키워드" },
  { key: "purpose", title: "목적", placeholder: "목적 키워드" },
];

function pickKeyword(keywords: string[]) {
  return keywords[Math.floor(Math.random() * keywords.length)] ?? "";
}

function getSelectedKeywords(
  category: KeywordCategory,
  selection?: KeywordSelection[SelectableKeywordKey],
) {
  return category.groups.flatMap((group, groupIndex) => {
    const groupSelection = selection?.[groupIndex];
    if (selection && !groupSelection?.enabled) return [];

    return [
      ...group.keywords,
      ...group.subgroups.flatMap((subgroup, subgroupIndex) =>
        selection && !groupSelection?.subgroups[subgroupIndex]
          ? []
          : subgroup.keywords,
      ),
    ];
  });
}

export function RandomKeywordGenerator({
  keywords,
}: RandomKeywordGeneratorProps) {
  const selectableKeys: SelectableKeywordKey[] = [
    "noun",
    "verbAdjectiveAdverb",
    "style",
  ];
  const [selection, setSelection] = useState<KeywordSelection>(
    () =>
      Object.fromEntries(
        selectableKeys.map((key) => [
          key,
          keywords[key].groups.map((group) => ({
            enabled: true,
            subgroups: group.subgroups.map(() => true),
          })),
        ]),
      ) as KeywordSelection,
  );
  const [selected, setSelected] = useState<Record<KeywordKey, string>>({
    noun: "",
    verbAdjectiveAdverb: "",
    style: "",
    purpose: "",
  });

  const generateKeywords = () => {
    const nextSelected = { ...selected };

    outputs.forEach(({ key }) => {
      const availableKeywords =
        key === "purpose"
          ? getSelectedKeywords(keywords[key])
          : getSelectedKeywords(keywords[key], selection[key]);
      nextSelected[key] = pickKeyword(availableKeywords);
    });

    setSelected(nextSelected);
  };

  const resetKeywords = () => {
    setSelected({ noun: "", verbAdjectiveAdverb: "", style: "", purpose: "" });
  };

  const toggleSetting = (
    categoryKey: SelectableKeywordKey,
    groupIndex: number,
    subgroupIndex?: number,
  ) => {
    setSelection((current) => {
      const categorySelection = current[categoryKey].map((group) => ({
        enabled: group.enabled,
        subgroups: [...group.subgroups],
      }));
      const groupSelection = categorySelection[groupIndex];

      if (!groupSelection) return current;

      if (subgroupIndex === undefined) {
        const enabled = !groupSelection.enabled;
        categorySelection[groupIndex] = {
          enabled,
          subgroups: groupSelection.subgroups.map(() => enabled),
        };
      } else {
        groupSelection.subgroups[subgroupIndex] =
          !groupSelection.subgroups[subgroupIndex];
      }

      return { ...current, [categoryKey]: categorySelection };
    });
  };

  return (
    <>
      <div className="h-3/4 flex flex-col items-center justify-center">
        <div className="flex items-center justify-center">
          {outputs.map(({ key, title, placeholder }) => (
            <TitleKeywordOutput
              key={key}
              title={title}
              placeholder={placeholder}
              value={selected[key]}
            />
          ))}
        </div>
        <div>
          <button
            type="button"
            className="bg-white text-black py-2 px-4 rounded"
            onClick={resetKeywords}
          >
            초기화
          </button>
          <button
            type="button"
            className="bg-blue-500 text-white py-2 px-4 rounded"
            onClick={generateKeywords}
          >
            만들기
          </button>
        </div>
      </div>
      <KeywordSetting
        keywords={keywords}
        selection={selection}
        onToggleGroup={toggleSetting}
      />
    </>
  );
}
