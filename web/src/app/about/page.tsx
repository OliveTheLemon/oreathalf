import type { Metadata } from "next";
import AboutExperience from "@/components/about/AboutExperience";

export const metadata: Metadata = {
  title: "about | oreathalf",
  description: "소개합니다. oreathalf에 대해.",
};

export default function AboutPage() {
  return <AboutExperience />;
}
