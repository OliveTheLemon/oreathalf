// import { client } from "@/sanity/client";

export default async function Home() {
  // const sanityStatus = await client
  //   .fetch('*[_type == "siteSettings"][0]{title}')
  //   .catch(() => null);

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-[#FFF3CD] px-4 text-center">
      <h1 className="text-3xl md:text-6xl font-semibold text-[#1f1f1f]">
        ox.....EXX HXXX!
      </h1>
    </main>
  );
}
