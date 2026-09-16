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
  const [showSelectionModal, setShowSelectionModal] = useState(false);

  const getAvailableKeywords = (key: KeywordKey) =>
    key === "purpose"
      ? getSelectedKeywords(keywords[key])
      : getSelectedKeywords(keywords[key], selection[key]);

  const hasSelectedKeywords = selectableKeys.some(
    (key) => getAvailableKeywords(key).length > 0,
  );

  const refreshKeyword = (key: KeywordKey) => {
    if (key !== "purpose" && getAvailableKeywords(key).length === 0) {
      setShowSelectionModal(true);
      return;
    }

    setSelected((current) => ({
      ...current,
      [key]: pickKeyword(getAvailableKeywords(key)),
    }));
  };

  const generateKeywords = () => {
    if (!hasSelectedKeywords) {
      setShowSelectionModal(true);
      return;
    }

    const nextSelected = { ...selected };

    outputs.forEach(({ key }) => {
      nextSelected[key] = pickKeyword(getAvailableKeywords(key));
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

  const toggleAll = (categoryKey: SelectableKeywordKey, enabled: boolean) => {
    setSelection((current) => ({
      ...current,
      [categoryKey]: current[categoryKey].map((group) => ({
        enabled,
        subgroups: group.subgroups.map(() => enabled),
      })),
    }));
  };

  return (
    <>
      <div className="lg:h-3/4 md:h-3/4 flex flex-col items-center justify-center">
        <div className="grid w-full grid-cols-1 items-center justify-items-center sm:grid-cols-2 lg:grid-cols-4">
          {outputs.map(({ key, title, placeholder }) => (
            <TitleKeywordOutput
              key={key}
              title={title}
              placeholder={placeholder}
              value={selected[key]}
              onRefresh={() => refreshKeyword(key)}
            />
          ))}
        </div>
        <div className="flex gap-2 mt-4">
          <button
            type="button"
            className="bg-white text-black py-2 px-4 rounded"
            onClick={resetKeywords}
          >
            초기화
          </button>
          <button
            type="button"
            className="bg-amber-500 text-white py-2 px-4 rounded"
            onClick={generateKeywords}
          >
            만들기
          </button>
        </div>
      </div>
      <p className="text-center text-sm text-neutral-500">
        포스터 만들기 연습을 위한 랜덤 키워드 생성기 입니다.
        <br /> "만들기" 버튼을 누르면 각 키워드가 생성되고, 개별로 새로고침도
        가능합니다.
        <br /> 아래 설정에서 포함/제외하고 싶은 주제도 선택할 수 있습니다.
        <br /> 스타일 키워드는 Pinterest에 검색하여 레퍼런스를 참고해보세요!
      </p>
      <KeywordSetting
        keywords={keywords}
        selection={selection}
        onToggleGroup={toggleSetting}
        onToggleAll={toggleAll}
      />
      {showSelectionModal && (
        <div
          className="fixed inset-0 z-10 flex items-center justify-center bg-black/40"
          role="presentation"
          onClick={() => setShowSelectionModal(false)}
        >
          <div
            className="w-80 rounded bg-white p-6 text-black shadow-lg"
            role="dialog"
            aria-modal="true"
            aria-labelledby="selection-modal-title"
            onClick={(event) => event.stopPropagation()}
          >
            <h2 id="selection-modal-title" className="font-bold">
              키워드를 선택해 주세요
            </h2>
            <p className="mt-2">하나 이상의 주제를 선택해야 합니다.</p>
            <button
              type="button"
              className="mt-4 bg-black px-4 py-2 text-white rounded"
              onClick={() => setShowSelectionModal(false)}
            >
              확인
            </button>
          </div>
        </div>
      )}
    </>
  );
}
