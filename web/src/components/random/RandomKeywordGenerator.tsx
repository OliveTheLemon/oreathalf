"use client";

import { KeywordSetting } from "@/components/random/KeywordSetting";
import { TitleKeywordOutput } from "@/components/random/TitleKeywordOutput";
import {
  outputs,
  useRandomKeywordGenerator,
} from "@/components/random/useRandomKeywordGenerator";

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

export function RandomKeywordGenerator({
  keywords,
}: RandomKeywordGeneratorProps) {
  const {
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
  } = useRandomKeywordGenerator(keywords);

  return (
    <>
      <div className="lg:h-3/4 md:h-3/4 flex flex-col items-center">
        <div className="grid w-4/5 grid-cols-1 items-center justify-items-center sm:grid-cols-2 lg:grid-cols-4 lg:gap-32">
          {outputs.map(({ key, title, placeholder }) => (
            <TitleKeywordOutput
              key={key}
              title={title}
              placeholder={placeholder}
              value={selected[key]}
              refreshTestId={`keyword-refresh-${key}`}
              resultTestId={`keyword-result-${key}`}
              onRefresh={() => refreshKeyword(key)}
            />
          ))}
        </div>
        <div className="mt-4 flex flex-wrap justify-center gap-2">
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
            data-testid="random-generate"
            onClick={generateKeywords}
          >
            만들기
          </button>
        </div>
        <div className="mt-3 flex flex-wrap justify-center gap-2 text-xs">
          <button
            type="button"
            className="rounded bg-neutral-300 px-4 py-2 text-black disabled:cursor-not-allowed disabled:opacity-40"
            onClick={copyGeneratedText}
            disabled={!generatedText}
          >
            키워드 텍스트 복사
          </button>
          <button
            type="button"
            className="rounded bg-neutral-300 px-4 py-2 text-black disabled:cursor-not-allowed disabled:opacity-40"
            onClick={handleSaveGeneratedImage}
            disabled={!generatedText}
          >
            이미지로 저장
          </button>
        </div>
        {actionMessage && (
          <p className="mt-2 text-sm text-neutral-600" role="status">
            {actionMessage}
          </p>
        )}
      </div>
      <p className="text-center text-sm text-neutral-500 mt-4">
        <br /> [만들기]버튼을 누르면 각 키워드가 생성되고, 개별로 새로고침도
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
