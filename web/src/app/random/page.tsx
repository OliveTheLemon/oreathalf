import { readFileSync } from "node:fs";
import { join } from "node:path";
import {
  RandomKeywordGenerator,
  type KeywordCategory,
  type KeywordGroup,
} from "@/components/random/RandomKeywordGenerator";

function readKeywords(fileName: string): KeywordCategory {
  const filePath = join(process.cwd(), "src", "assets", "keywords", fileName);
  const groups: KeywordGroup[] = [];
  let currentGroup: KeywordGroup | undefined;
  let currentSubgroup: { title: string; keywords: string[] } | undefined;

  for (const line of readFileSync(filePath, "utf8").split(/\r?\n/)) {
    const trimmedLine = line.trim();

    if (!trimmedLine) continue;

    if (trimmedLine.startsWith("{") && trimmedLine.endsWith("}")) {
      currentGroup = {
        title: trimmedLine.slice(1, -1).trim(),
        keywords: [],
        subgroups: [],
      };
      groups.push(currentGroup);
      currentSubgroup = undefined;
      continue;
    }

    if (trimmedLine.startsWith("[") && trimmedLine.endsWith("]")) {
      if (!currentGroup) {
        currentGroup = { title: "기타", keywords: [], subgroups: [] };
        groups.push(currentGroup);
      }

      currentSubgroup = {
        title: trimmedLine.slice(1, -1).trim(),
        keywords: [],
      };
      currentGroup.subgroups.push(currentSubgroup);
      continue;
    }

    const parsedKeywords = trimmedLine
      .split(",")
      .map((keyword) => keyword.trim())
      .filter(Boolean);

    if (currentSubgroup) {
      currentSubgroup.keywords.push(...parsedKeywords);
    } else {
      if (!currentGroup) {
        currentGroup = { title: "기타", keywords: [], subgroups: [] };
        groups.push(currentGroup);
      }
      currentGroup.keywords.push(...parsedKeywords);
    }
  }

  return { groups };
}

export default async function RandomKeywordPage() {
  const keywords = {
    noun: readKeywords("1.Noun.txt"),
    verbAdjectiveAdverb: readKeywords("2.Verb-Adjective-Adverb.txt"),
    style: readKeywords("3.Style.txt"),
    purpose: readKeywords("4.Purpose.txt"),
  };

  return (
    <main className="min-h-screen bg-background text-foreground pt-[30px] md:pt-[50px]">
      <div className="mx-auto max-w-5xl px-5 pb-20 pt-10 sunflower-light sm:px-10 sm:pt-16">
        <header className="mb-8 border-b-2 border-black pb-7">
          <p className="sunflower-medium mb-3 text-sm text-black/55">
            RANDOM KEYWORD GENERATOR
          </p>
          <h1 className="sunflower-bold text-4xl leading-tight sm:text-6xl">
            랜덤 키워드 생성기
          </h1>
          <p className="mt-3 text-sm text-black/60">
            포스터 만들기 연습을 위한 랜덤 키워드 생성기 입니다.
          </p>
        </header>
        <RandomKeywordGenerator keywords={keywords} />
      </div>
    </main>
  );
}
