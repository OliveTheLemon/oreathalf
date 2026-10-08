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
    <>
      <div className="container mx-auto py-8 h-screen sunflower-light pt-[50px] md:pt-[100px]">
        <h1 className="text-3xl font-bold mb-4 text-center">
          랜덤 키워드 생성기
        </h1>
        <RandomKeywordGenerator keywords={keywords} />
      </div>
    </>
  );
}
