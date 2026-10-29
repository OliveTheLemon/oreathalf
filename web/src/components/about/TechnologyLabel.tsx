import styles from "./TechnologyLabel.module.css";

interface TechnologyLabelProps {
  text: string;
  className?: string;
}

export default function TechnologyLabel({
  text,
  className = "",
}: TechnologyLabelProps) {
  return (
    <span className={`${styles.label} ${className}`.trim()}>
      {text}
    </span>
  );
}
