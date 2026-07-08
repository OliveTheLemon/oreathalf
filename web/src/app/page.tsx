// import { client } from "@/sanity/client";

export default async function Home() {
  // const sanityStatus = await client
  //   .fetch('*[_type == "siteSettings"][0]{title}')
  //   .catch(() => null);

  const images = Array.from({ length: 25 }, (_, index) => ({
    id: index + 1,
    src: `https://picsum.photos/seed/oreathalf-${index + 1}/400/400`,
    alt: `이미지 ${index + 1}`,
  }));

  return (
    <main className="min-h-screen bg-[#FFF3CD] py-8 text-center">
      <section className="mx-auto flex min-h-screen max-w-6xl flex-col items-center justify-center">
        <h1 className="text-3xl font-semibold text-[#1f1f1f] md:text-6xl">
          ox.....EXX HXXX!
        </h1>
      </section>

      <section className="mx-auto">
        <div className="grid w-full grid-cols-2 sm:grid-cols-3 lg:grid-cols-5">
          {images.map((image) => (
            <img
              key={image.id}
              src={image.src}
              alt={image.alt}
              loading="lazy"
              className="w-full object-cover aspect-[9/16] lg:aspect-[9/8] sm:aspect-[9/8] md:aspect-[9/8]"
            />
          ))}
        </div>
      </section>
    </main>
  );
}
