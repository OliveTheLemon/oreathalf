export default function IngredientLoading() {
  return (
    <main
      aria-busy="true"
      aria-live="polite"
      className="min-h-screen bg-background text-center sunflower-bold"
    >
      <div
        role="status"
        className="pointer-events-none fixed inset-0 z-50 flex items-center justify-center"
      >
        <svg
          aria-hidden="true"
          className="h-12 w-12 animate-spin text-amber-500"
          viewBox="0 0 24 24"
          fill="none"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-90"
            fill="currentColor"
            d="M4 12a8 8 0 0 1 8-8V0C5.373 0 0 5.373 0 12h4zm2 5.3A7.96 7.96 0 0 1 4 12H0c0 3.04 1.135 5.824 3 7.938L6 17.3z"
          />
        </svg>
        <span className="sr-only">재료 이미지를 불러오는 중입니다.</span>
      </div>

      {/* <div className="fixed left-1/2 top-0 z-50 flex h-[50px] -translate-x-1/2 items-center justify-between md:h-[100px]">
        <div className="h-8 w-24 animate-pulse rounded bg-neutral-200 md:h-10 md:w-32" />
      </div> */}
      {/* 
      <div className="grid w-full grid-cols-2 pt-[50px] sm:grid-cols-3 md:pt-[100px] lg:grid-cols-5">
        {Array.from({ length: 10 }, (_, index) => (
          <div
            key={index}
            className="aspect-[9/16] animate-pulse bg-neutral-200 sm:aspect-square md:aspect-square lg:aspect-square"
          />
        ))}
      </div> */}
    </main>
  );
}
