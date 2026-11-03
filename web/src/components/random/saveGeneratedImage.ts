export function saveGeneratedImage(generatedText: string): boolean {
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");
  if (!context) return false;

  canvas.width = 800;
  canvas.height = 800;
  context.fillStyle = "#fff3cd";
  context.fillRect(0, 0, canvas.width, canvas.height);
  context.fillStyle = "#1f1f1f";
  context.textBaseline = "top";
  context.font = "700 48px Sunflower, sans-serif";
  context.fillText("랜덤 키워드", 72, 64);

  // 직선 그리기
  context.beginPath();
  context.moveTo(72, 132);
  context.lineTo(canvas.width - 72, 132);
  context.strokeStyle = "#1f1f1f";
  context.lineWidth = 2;
  context.stroke();

  context.font = "500 48px Sunflower, sans-serif";
  generatedText.split("\n").forEach((line, index) => {
    context.fillText(line, 72, 160 + index * 120, canvas.width - 144);
  });

  const savedDate = new Intl.DateTimeFormat("ko-KR", {
    dateStyle: "long",
  }).format(new Date());
  context.font = "400 24px Sunflower, sans-serif";
  context.fillText(`저장일: ${savedDate}`, 72, 716);

  const link = document.createElement("a");
  link.download = "oreathalf-random-keywords.png";
  link.href = canvas.toDataURL("image/png");
  link.click();
  return true;
}
