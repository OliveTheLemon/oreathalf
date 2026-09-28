import type { Metadata } from "next";
import { WhatIAteToday } from "@/components/WhatIAteToday";

export const metadata: Metadata = {
  title: "오늘 먹은 것 | oreathalf",
  description: "오늘의 식사를 기록하고 돌아보세요.",
};

export default function WhatIAteTodayPage() {
  return <WhatIAteToday />;
}
