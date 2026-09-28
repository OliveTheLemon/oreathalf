export type MealType = "아침" | "점심" | "저녁" | "간식";
export type ImageSize = "1080x1920" | "1080x1350" | "1080x1080";

export type MealPosterEntry = {
  meal: MealType;
  time: string;
  food: string;
  eatHalf: boolean;
};

export const mealTypes: MealType[] = ["아침", "점심", "저녁", "간식"];
export const imageSizes: ImageSize[] = ["1080x1920", "1080x1350", "1080x1080"];

function formatDate(dateKey: string) {
  if (!dateKey) return "";
  return new Intl.DateTimeFormat("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
    weekday: "long",
  }).format(new Date(`${dateKey}T12:00:00`));
}

function drawPosterText(
  context: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
) {
  let line = "";
  let lineCount = 0;
  const lines: string[] = [];

  for (const character of Array.from(text)) {
    const nextLine = line + character;
    if (line && context.measureText(nextLine).width > maxWidth) {
      lines.push(line);
      line = character;
    } else {
      line = nextLine;
    }
  }
  if (line) lines.push(line);

  const lineHeight = 48;
  for (const textLine of lines) {
    context.fillText(textLine, x, y + lineCount * lineHeight);
    lineCount += 1;
    if (lineCount === 2) break;
  }

  return lineCount;
}

export async function downloadMealPoster(
  dateKey: string,
  entries: MealPosterEntry[],
  imageSize: ImageSize,
) {
  await document.fonts.ready;

  const [width, height] = imageSize.split("x").map(Number);
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext("2d");
  if (!context) throw new Error("이미지 캔버스를 만들 수 없습니다.");

  context.fillStyle = "#fff3cd";
  context.fillRect(0, 0, width, height);
  context.fillStyle = "#df583f";
  context.fillRect(0, 0, width, 18);

  const compact = height === 1080;
  const margin = 78;
  const contentTop = compact ? 300 : height === 1350 ? 330 : 390;
  const footerTop = height - 105;
  const sectionHeight = (footerTop - contentTop) / mealTypes.length;

  context.fillStyle = "#1f1f1f";
  context.textAlign = "left";
  context.textBaseline = "alphabetic";
  context.font = "700 25px 'Iosevka Charon Mono', monospace";
  context.fillText("OREATHALF  /  FOOD JOURNAL", margin, 88);
  context.font = `700 ${compact ? 68 : 88}px Sunflower, sans-serif`;
  context.fillText("오늘 먹은 것", margin, compact ? 174 : 205);
  context.font = "400 27px 'Iosevka Charon Mono', monospace";
  context.fillStyle = "#5d5748";
  context.fillText(formatDate(dateKey), margin, compact ? 220 : 263);

  context.strokeStyle = "#1f1f1f";
  context.lineWidth = 3;
  context.beginPath();
  context.moveTo(margin, compact ? 248 : 300);
  context.lineTo(width - margin, compact ? 248 : 300);
  context.stroke();

  mealTypes.forEach((meal, index) => {
    const top = contentTop + index * sectionHeight;
    const mealEntries = entries
      .filter((entry) => entry.meal === meal)
      .sort((first, second) => first.time.localeCompare(second.time));

    context.strokeStyle = "rgba(31, 31, 31, 0.22)";
    context.lineWidth = 2;
    context.beginPath();
    context.moveTo(margin, top);
    context.lineTo(width - margin, top);
    context.stroke();

    context.fillStyle = "#1f1f1f";
    context.font = "700 22px 'Iosevka Charon Mono', monospace";
    context.fillText(`0${index + 1}`, margin, top + 38);
    context.font = "700 38px Sunflower, sans-serif";
    context.fillText(meal, margin + 62, top + 42);

    const rowHeight = compact ? 45 : 52;
    const rowCapacity = Math.max(
      1,
      Math.floor((sectionHeight - 78) / rowHeight),
    );
    const visibleEntries = mealEntries.slice(0, rowCapacity);

    if (visibleEntries.length === 0) {
      context.fillStyle = "#77705f";
      context.font = "400 24px Sunflower, sans-serif";
      context.fillText("아직 기록이 없어요", margin + 62, top + 86);
    } else {
      visibleEntries.forEach((entry, entryIndex) => {
        const rowTop = top + 88 + entryIndex * rowHeight;
        context.fillStyle = "#1f1f1f";
        context.font = "500 26px Sunflower, sans-serif";
        drawPosterText(context, entry.food, margin + 62, rowTop, width - 270);
        context.textAlign = "right";
        context.fillStyle = entry.eatHalf ? "#df583f" : "#77705f";
        context.font = "400 20px 'Iosevka Charon Mono', monospace";
        context.fillText(
          `${entry.time}  ·  ${entry.eatHalf ? "EAT HALF" : ""}`,
          width - margin,
          rowTop,
        );
        context.textAlign = "left";
      });
      if (mealEntries.length > visibleEntries.length) {
        context.fillStyle = "#77705f";
        context.font = "400 18px 'Iosevka Charon Mono', monospace";
        context.fillText(
          `+ ${mealEntries.length - visibleEntries.length} MORE`,
          margin + 62,
          top + 88 + visibleEntries.length * rowHeight,
        );
      }
    }
  });

  context.strokeStyle = "#1f1f1f";
  context.lineWidth = 2;
  context.beginPath();
  context.moveTo(margin, footerTop);
  context.lineTo(width - margin, footerTop);
  context.stroke();
  context.fillStyle = "#1f1f1f";
  context.font = "700 21px 'Iosevka Charon Mono', monospace";
  context.fillText("or.....EAT HALF!", margin, height - 57);
  context.textAlign = "right";
  context.font = "400 18px 'Iosevka Charon Mono', monospace";
  context.fillText(`${entries.length} MEALS`, width - margin, height - 57);
  context.textAlign = "left";

  const imageBlob = await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) resolve(blob);
      else reject(new Error("이미지 파일을 만들지 못했습니다."));
    }, "image/png");
  });
  const imageUrl = URL.createObjectURL(imageBlob);
  const downloadLink = document.createElement("a");
  downloadLink.href = imageUrl;
  downloadLink.download = `oreathalf-${dateKey}-${width}x${height}.png`;
  downloadLink.click();
  URL.revokeObjectURL(imageUrl);
}
