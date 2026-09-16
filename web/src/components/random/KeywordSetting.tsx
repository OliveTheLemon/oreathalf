import { useState } from "react";
import type {
  KeywordCategory,
  KeywordSelection,
  SelectableKeywordKey,
} from "@/components/random/RandomKeywordGenerator";

interface KeywordSettingProps {
  keywords: Record<SelectableKeywordKey, KeywordCategory>;
  selection: KeywordSelection;
  onToggleGroup: (
    categoryKey: SelectableKeywordKey,
    groupIndex: number,
    subgroupIndex?: number,
  ) => void;
  onToggleAll: (categoryKey: SelectableKeywordKey, enabled: boolean) => void;
}

const tabs = [
  ["noun", "명사"],
  ["verbAdjectiveAdverb", "동사·형용사·부사"],
  ["style", "스타일"],
] as const;

export function KeywordSetting({
  keywords,
  selection,
  onToggleGroup,
  onToggleAll,
}: KeywordSettingProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<SelectableKeywordKey>("noun");
  const activeCategory = keywords[activeTab];

  return (
    <section className="w-full max-w-4xl mx-auto mt-8 pb-20">
      <button
        type="button"
        className="flex items-center gap-2 font-bold"
        aria-expanded={isOpen}
        onClick={() => setIsOpen((current) => !current)}
      >
        <span>설정</span>
        <span aria-hidden="true">{isOpen ? "▲" : "▼"}</span>
      </button>

      {isOpen && (
        <div className="mt-4">
          <div className="flex border-b border-black/20" role="tablist">
            {tabs.map(([key, label]) => (
              <button
                key={key}
                type="button"
                role="tab"
                aria-selected={activeTab === key}
                className={`px-4 py-2 ${activeTab === key ? "font-bold border-b-2 border-black" : ""}`}
                onClick={() => setActiveTab(key)}
              >
                {label}
              </button>
            ))}
          </div>

          <div className="mt-4 space-y-4" role="tabpanel">
            <div className="flex gap-2 justify-end text-sm">
              <button
                type="button"
                className="bg-white text-black px-3 py-1 rounded"
                onClick={() => onToggleAll(activeTab, true)}
              >
                전체선택
              </button>
              <button
                type="button"
                className="bg-white text-black px-3 py-1 rounded"
                onClick={() => onToggleAll(activeTab, false)}
              >
                전체취소
              </button>
            </div>
            {activeCategory.groups.map((group, groupIndex) => {
              const groupSelection = selection[activeTab][groupIndex];
              if (!groupSelection) return null;

              return (
                <div key={`${group.title}-${groupIndex}`}>
                  <label className="font-bold">
                    <input
                      type="checkbox"
                      checked={groupSelection.enabled}
                      onChange={() => onToggleGroup(activeTab, groupIndex)}
                    />{" "}
                    {group.title}
                  </label>

                  {group.keywords.length > 0 && (
                    <p
                      className={`ml-6 mt-1 text-sm ${groupSelection.enabled ? "" : "text-neutral-400"}`}
                    >
                      {group.keywords.join(", ")}
                    </p>
                  )}

                  {group.subgroups.map((subgroup, subgroupIndex) => (
                    <div
                      key={`${subgroup.title}-${subgroupIndex}`}
                      className="ml-6 mt-3"
                    >
                      <label>
                        <input
                          type="checkbox"
                          checked={groupSelection.subgroups[subgroupIndex]}
                          onChange={() =>
                            onToggleGroup(activeTab, groupIndex, subgroupIndex)
                          }
                        />{" "}
                        {subgroup.title}
                      </label>
                      <p
                        className={`ml-6 mt-1 text-sm ${groupSelection.enabled && groupSelection.subgroups[subgroupIndex] ? "" : "text-neutral-400"}`}
                      >
                        {subgroup.keywords.join(", ")}
                      </p>
                    </div>
                  ))}
                </div>
              );
            })}

            <p className="py-4 text-sm text-neutral-500">
              해당 데이터는 제가 작성한 키워드를 바탕으로 Gemini로 확장 및
              정제한 자료입니다.
            </p>
          </div>
        </div>
      )}
    </section>
  );
}
