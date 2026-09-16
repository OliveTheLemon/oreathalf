interface TitleKeywordOutputProps {
  title: string;
  placeholder: string;
  value?: string;
}

export function TitleKeywordOutput({
  title,
  placeholder,
  value,
}: TitleKeywordOutputProps) {
  return (
    <div className="flex flex-col justify-center p-4 m-2">
      <span>{title}</span>
      <span className="w-64 min-h-10 bg-white text-black py-2 px-4 rounded">
        {value || placeholder}
      </span>
    </div>
  );
}
