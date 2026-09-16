import { readFileSync } from "node:fs";
import { join } from "node:path";
import { RandomKeywordGenerator } from "@/components/random/RandomKeywordGenerator";

function readKeywords(fileName: string) {
  const filePath = join(process.cwd(), "src", "assets", "keywords", fileName);

  return readFileSync(filePath, "utf8")
    .split(/\r?\n/)
    .filter(
      (line) =>
        line.trim() &&
        !line.trim().startsWith("{") &&
        !line.trim().startsWith("["),
    )
    .flatMap((line) => line.split(","))
    .map((keyword) => keyword.trim())
    .filter(Boolean);
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
      <div className="container mx-auto py-8 h-screen sunflower-light">
        <RandomKeywordGenerator keywords={keywords} />
      </div>
    </>
  );
}
