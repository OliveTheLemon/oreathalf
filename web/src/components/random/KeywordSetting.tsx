interface KeywordSettingProps {
  enabled: {
    noun: boolean;
    verbAdjectiveAdverb: boolean;
    style: boolean;
  };
  onChange: (key: keyof KeywordSettingProps["enabled"]) => void;
}

const settings = [
  ["noun", "명사"],
  ["verbAdjectiveAdverb", "동사·형용사·부사"],
  ["style", "스타일"],
] as const;

export function KeywordSetting({ enabled, onChange }: KeywordSettingProps) {
  return (
    <fieldset>
      <legend>설정</legend>
      {settings.map(([key, label]) => (
        <label key={key} className="mr-4">
          <input
            type="checkbox"
            checked={enabled[key]}
            onChange={() => onChange(key)}
          />{" "}
          {label}
        </label>
      ))}
    </fieldset>
  );
}
