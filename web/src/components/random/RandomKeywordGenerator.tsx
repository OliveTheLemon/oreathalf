"use client";

import { useState } from "react";
import { KeywordSetting } from "@/components/random/KeywordSetting";
import { TitleKeywordOutput } from "@/components/random/TitleKeywordOutput";

interface KeywordGroups {
  noun: string[];
  verbAdjectiveAdverb: string[];
  style: string[];
  purpose: string[];
}

interface RandomKeywordGeneratorProps {
  keywords: KeywordGroups;
}

type KeywordKey = keyof KeywordGroups;
type EnabledKeywords = Record<Exclude<KeywordKey, "purpose">, boolean>;

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

export function RandomKeywordGenerator({
  keywords,
}: RandomKeywordGeneratorProps) {
  const [enabled, setEnabled] = useState<EnabledKeywords>({
    noun: true,
    verbAdjectiveAdverb: true,
    style: true,
  });
  const [selected, setSelected] = useState<Record<KeywordKey, string>>({
    noun: "",
    verbAdjectiveAdverb: "",
    style: "",
    purpose: "",
  });

  const generateKeywords = () => {
    const nextSelected = { ...selected };

    outputs.forEach(({ key }) => {
      if (key === "purpose" || enabled[key]) {
        nextSelected[key] = pickKeyword(keywords[key]);
      } else {
        nextSelected[key] = "";
      }
    });

    setSelected(nextSelected);
  };

  const resetKeywords = () => {
    setSelected({ noun: "", verbAdjectiveAdverb: "", style: "", purpose: "" });
  };

  const toggleSetting = (key: keyof EnabledKeywords) => {
    setEnabled((current) => ({ ...current, [key]: !current[key] }));
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
      <KeywordSetting enabled={enabled} onChange={toggleSetting} />
    </>
  );
}
