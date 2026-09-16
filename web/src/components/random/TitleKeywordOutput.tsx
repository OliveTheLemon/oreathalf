interface TitleKeywordOutputProps {
  title: string;
  placeholder: string;
  value?: string;
  onRefresh: () => void;
}

export function TitleKeywordOutput({
  title,
  placeholder,
  value,
  onRefresh,
}: TitleKeywordOutputProps) {
  return (
    <div className="flex flex-col justify-center p-2 m-2">
      <div className="flex items-center gap-2">
        <span>{title}</span>
        <button
          type="button"
          aria-label={`${title} 새로고침`}
          title={`${title} 새로고침`}
          className="text-lg leading-none"
          onClick={onRefresh}
        >
          ↻
        </button>
      </div>
      <span className="w-48 h-[75px] bg-white text-black py-2 px-4 rounded mt-4 flex items-center justify-center text-center break-keep sunflower-medium text-lg">
        {value || placeholder}
      </span>
    </div>
  );
}
