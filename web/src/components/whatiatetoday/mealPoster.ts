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
  return dateKey.replace(/-/g, ".");
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

  const fontSize = Number(context.font.match(/(\d+(?:\.\d+)?)px/)?.[1] ?? 36);
  const lineHeight = fontSize * 1.08;
  for (const textLine of lines) {
    context.fillText(textLine, x, y + lineCount * lineHeight);
    lineCount += 1;
    if (lineCount === 2) break;
  }

  return lineCount;
}

function drawReceiptRule(
  context: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
) {
  context.beginPath();
  context.setLineDash([5, 8]);
  context.moveTo(x, y);
  context.lineTo(x + width, y);
  context.stroke();
  context.setLineDash([]);
}

function drawReceiptPaper(
  context: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
) {
  context.fillStyle = "#ffffff";
  context.fillRect(x, y, width, height);
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

  context.fillStyle = "#ffffff";
  context.fillRect(0, 0, width, height);

  const paperX = Math.round(width * 0.055);
  const paperY = Math.round(height * 0.025);
  const paperWidth = width - paperX * 2;
  const paperHeight = height - paperY * 2;
  const margin = paperX + Math.round(paperWidth * 0.075);
  const right = width - margin;
  const contentWidth = right - margin;
  const headerRuleY = paperY + Math.round(height * 0.285);
  const listHeaderY = headerRuleY + Math.round(height * 0.09);
  const footerTop = paperY + paperHeight - Math.round(height * 0.18);
  const rowsTop = listHeaderY + Math.round(height * 0.075);
  const rowAreaHeight = footerTop - rowsTop - Math.round(height * 0.035);
  const rowHeight = Math.min(
    116,
    Math.max(82, rowAreaHeight / Math.max(entries.length, 1)),
  );
  const visibleEntries = entries.slice(
    0,
    Math.max(1, Math.floor(rowAreaHeight / rowHeight)),
  );

  drawReceiptPaper(context, paperX, paperY, paperWidth, paperHeight);

  context.fillStyle = "#111111";
  context.textBaseline = "alphabetic";
  context.textAlign = "center";
  context.font = `700 ${Math.round(width * 0.073)}px 'Iosevka Charon Mono', 'Courier New', monospace`;
  context.fillText("OREATHALF", width / 2, paperY + Math.round(height * 0.09));
  context.font = `500 ${Math.round(width * 0.036)}px 'Iosevka Charon Mono', 'Courier New', monospace`;
  context.fillText(
    "DAILY FOOD JOURNAL",
    width / 2,
    paperY + Math.round(height * 0.135),
  );
  context.font = `700 ${Math.round(width * 0.065)}px Sunflower, 'Malgun Gothic', sans-serif`;
  context.fillText(
    "오늘 먹은 것",
    width / 2,
    paperY + Math.round(height * 0.205),
  );

  context.textAlign = "left";
  context.font = `500 ${Math.round(width * 0.048)}px 'Iosevka Charon Mono', 'Malgun Gothic', monospace`;
  context.fillText(
    formatDate(dateKey),
    margin,
    headerRuleY - Math.round(height * 0.02),
  );
  context.textAlign = "right";
  const savedAt = new Intl.DateTimeFormat("ko-KR", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(new Date());
  context.fillText(savedAt, right, headerRuleY - Math.round(height * 0.02));

  context.strokeStyle = "#111111";
  context.lineWidth = Math.max(2, width * 0.002);
  drawReceiptRule(context, margin, headerRuleY, contentWidth);

  context.textAlign = "left";
  context.font = `700 ${Math.round(width * 0.052)}px 'Iosevka Charon Mono', 'Malgun Gothic', monospace`;
  context.fillText("ITEM", margin, listHeaderY);
  context.textAlign = "right";
  context.fillText("MEAL / TIME", right, listHeaderY);

  context.strokeStyle = "#111111";
  context.lineWidth = Math.max(2, width * 0.002);
  drawReceiptRule(
    context,
    margin,
    listHeaderY + Math.round(height * 0.022),
    contentWidth,
  );

  if (entries.length === 0) {
    context.textAlign = "left";
    context.fillStyle = "#555555";
    context.font = `500 ${Math.round(width * 0.045)}px 'Iosevka Charon Mono', 'Malgun Gothic', monospace`;
    context.fillText(
      "아직 기록이 없습니다",
      margin,
      rowsTop + rowHeight * 0.55,
    );
  }

  visibleEntries.forEach((entry, index) => {
    const rowTop = rowsTop + index * rowHeight;
    const itemFontSize = Math.round(Math.min(width * 0.05, rowHeight * 0.42));
    context.textAlign = "left";
    context.fillStyle = "#111111";
    context.font = `500 ${itemFontSize}px 'Iosevka Charon Mono', 'Malgun Gothic', monospace`;
    const itemLines = drawPosterText(
      context,
      entry.food,
      margin,
      rowTop + itemFontSize,
      contentWidth * 0.61,
    );
    context.textAlign = "right";
    context.fillStyle = "#222222";
    context.font = `500 ${Math.round(itemFontSize * 0.76)}px 'Iosevka Charon Mono', 'Malgun Gothic', monospace`;
    context.fillText(
      `${entry.meal}  ${entry.time}`,
      right,
      rowTop + itemFontSize,
    );
    if (entry.eatHalf) {
      context.textAlign = "left";
      context.fillStyle = "#555555";
      context.font = `500 ${Math.round(itemFontSize * 0.58)}px 'Iosevka Charon Mono', monospace`;
      context.fillText("EAT HALF", margin, rowTop + itemFontSize * 1.75);
    }
    if (index < visibleEntries.length - 1) {
      context.strokeStyle = "#999999";
      context.lineWidth = Math.max(1, width * 0.001);
      drawReceiptRule(
        context,
        margin,
        rowTop + Math.max(rowHeight * 0.72, itemLines * itemFontSize + 12),
        contentWidth,
      );
    }
  });

  if (entries.length > visibleEntries.length) {
    context.textAlign = "left";
    context.fillStyle = "#555555";
    context.font = `500 ${Math.round(width * 0.032)}px 'Iosevka Charon Mono', monospace`;
    context.fillText(
      `+ ${entries.length - visibleEntries.length} MORE ITEMS`,
      margin,
      footerTop - Math.round(height * 0.025),
    );
  }

  context.strokeStyle = "#111111";
  context.lineWidth = Math.max(2, width * 0.002);
  drawReceiptRule(context, margin, footerTop, contentWidth);
  context.textAlign = "left";
  context.fillStyle = "#111111";
  context.font = `700 ${Math.round(width * 0.049)}px 'Iosevka Charon Mono', 'Malgun Gothic', monospace`;
  context.fillText(
    "TOTAL ITEMS",
    margin,
    footerTop + Math.round(height * 0.065),
  );
  context.textAlign = "right";
  context.font = `700 ${Math.round(width * 0.065)}px 'Iosevka Charon Mono', 'Courier New', monospace`;
  context.fillText(
    String(entries.length).padStart(2, "0"),
    right,
    footerTop + Math.round(height * 0.065),
  );
  context.textAlign = "center";
  context.fillStyle = "#111111";
  context.font = `700 ${Math.round(width * 0.044)}px 'Iosevka Charon Mono', 'Malgun Gothic', monospace`;
  context.fillText(
    "오늘도 맛있게 드셨나요?",
    width / 2,
    footerTop + Math.round(height * 0.14),
  );
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
