import { useState } from "react";
import { saveGeneratedImage as downloadGeneratedImage } from "@/components/random/saveGeneratedImage";
import type {
  KeywordCategory,
  KeywordGroups,
  KeywordKey,
  KeywordSelection,
  SelectableKeywordKey,
} from "@/components/random/RandomKeywordGenerator";

export const outputs: Array<{
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

export function useRandomKeywordGenerator(keywords: KeywordGroups) {
  const selectableKeys: SelectableKeywordKey[] = [
    "noun",
    "verbAdjectiveAdverb",
    "style",
  ];
  const [selection, setSelection] = useState<KeywordSelection>(() =>
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
  const [actionMessage, setActionMessage] = useState("");

  const generatedText = outputs
    .filter(({ key }) => selected[key])
    .map(({ key, title }) => `${title}: ${selected[key]}`)
    .join("\n");

  const copyGeneratedText = async () => {
    if (!generatedText) return;

    try {
      await navigator.clipboard.writeText(generatedText);
      setActionMessage("키워드를 복사했습니다.");
    } catch {
      setActionMessage("복사하지 못했습니다. 브라우저 권한을 확인해 주세요.");
    }
  };

  const handleSaveGeneratedImage = () => {
    if (!generatedText) return;

    if (!downloadGeneratedImage(generatedText)) {
      setActionMessage("이미지를 저장하지 못했습니다.");
      return;
    }
    setActionMessage("키워드 이미지를 저장했습니다.");
  };

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

  return {
    actionMessage,
    copyGeneratedText,
    generatedText,
    generateKeywords,
    handleSaveGeneratedImage,
    resetKeywords,
    selected,
    selection,
    setShowSelectionModal,
    showSelectionModal,
    toggleAll,
    toggleSetting,
    refreshKeyword,
  };
}
