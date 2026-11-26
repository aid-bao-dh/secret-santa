export interface CardExportData {
  currentUser: {
    name: string;
    department: string;
  };
  giftRecipient: {
    name: string;
    department: string;
    avatar?: string;
    bio?: string;
  };
  santaHints: string[];
}

/**
 * Generates a high-resolution, rock-solid Christmas Postcard PNG using HTML5 Canvas.
 * Uses retina 2x scale, Google Font readiness, and aspect-ratio safe (object-cover) avatar cropping.
 */
export async function generateSecretSantaCard(data: CardExportData): Promise<string> {
  // Wait for custom web fonts (Nunito) before drawing on canvas
  if (typeof document !== "undefined" && document.fonts?.ready) {
    try {
      await document.fonts.ready;
    } catch {
      // proceed with fallback fonts
    }
  }

  const width = 800;
  const height = 1120;
  const scale = 2; // 1600x2240 crisp Retina PNG
  const canvas = document.createElement("canvas");
  canvas.width = width * scale;
  canvas.height = height * scale;
  const rawCtx = canvas.getContext("2d");

  if (!rawCtx) {
    throw new Error("Canvas context is not supported");
  }
  const ctx: CanvasRenderingContext2D = rawCtx;
  ctx.scale(scale, scale);
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";

  const fontPrimary = `'Nunito', 'Plus Jakarta Sans', system-ui, -apple-system, sans-serif`;

  function roundRect(
    x: number,
    y: number,
    w: number,
    h: number,
    radius: number,
    fill = true,
    stroke = false
  ) {
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + w - radius, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + radius);
    ctx.lineTo(x + w, y + h - radius);
    ctx.quadraticCurveTo(x + w, y + h, x + w - radius, y + h);
    ctx.lineTo(x + radius, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
    if (fill) ctx.fill();
    if (stroke) ctx.stroke();
  }

  function truncateToWidth(text: string, maxWidth: number): string {
    if (ctx.measureText(text).width <= maxWidth) return text;
    let trimmed = text;
    while (trimmed.length > 0 && ctx.measureText(trimmed + "...").width > maxWidth) {
      trimmed = trimmed.slice(0, -1);
    }
    return trimmed.trimEnd() + "...";
  }

  function wrapText(
    text: string,
    x: number,
    y: number,
    maxWidth: number,
    lineHeight: number,
    maxLines = 4
  ) {
    const words = text.split(/\s+/);
    let line = "";
    let linesDrawn = 0;

    for (let n = 0; n < words.length; n++) {
      const testLine = line ? `${line} ${words[n]}` : words[n];
      if (ctx.measureText(testLine).width > maxWidth && line) {
        if (linesDrawn >= maxLines - 1) {
          const remaining = `${line} ${words.slice(n).join(" ")}`;
          ctx.fillText(truncateToWidth(remaining, maxWidth), x, y);
          return y + lineHeight;
        }
        ctx.fillText(line, x, y);
        line = words[n];
        y += lineHeight;
        linesDrawn++;
      } else {
        line = testLine;
      }
    }
    if (line) {
      ctx.fillText(truncateToWidth(line, maxWidth), x, y);
    }
    return y + lineHeight;
  }

  // 1. Background Gradient (Vibrant Festive Christmas Red & Pine Green)
  const bgGrad = ctx.createLinearGradient(0, 0, width, height);
  bgGrad.addColorStop(0, "#dc2626");
  bgGrad.addColorStop(0.35, "#b91c1c");
  bgGrad.addColorStop(0.75, "#991b1b");
  bgGrad.addColorStop(1, "#15803d");
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, width, height);

  // 2. Snow White & Golden Borders
  ctx.strokeStyle = "#ffffff";
  ctx.lineWidth = 4;
  roundRect(24, 24, width - 48, height - 48, 20, false, true);

  ctx.strokeStyle = "#facc15";
  ctx.lineWidth = 2;
  roundRect(32, 32, width - 64, height - 64, 16, false, true);

  // Corner ornaments
  ctx.font = `24px ${fontPrimary}`;
  ctx.fillStyle = "#facc15";
  ctx.textAlign = "center";
  ctx.fillText("❄", 50, 56);
  ctx.fillText("❄", width - 50, 56);
  ctx.fillText("❄", 50, height - 42);
  ctx.fillText("❄", width - 50, height - 42);

  // 3. Top Header
  ctx.textAlign = "center";
  ctx.font = `800 14px ${fontPrimary}`;
  ctx.fillStyle = "#fde047";
  ctx.fillText("✦ NHIỆM VỤ BÍ MẬT • SECRET SANTA GLOBAL SAFE ✦", width / 2, 72);

  ctx.font = `900 34px ${fontPrimary}`;
  ctx.fillStyle = "#ffffff";
  ctx.shadowColor = "rgba(234, 179, 8, 0.55)";
  ctx.shadowBlur = 12;
  ctx.fillText("THẺ NHIỆM VỤ SECRET SANTA 🎅", width / 2, 116);
  ctx.shadowBlur = 0;

  // Personalized subtitle
  ctx.font = `700 16px ${fontPrimary}`;
  ctx.fillStyle = "#fef08a";
  ctx.fillText(
    `Thành viên: ${data.currentUser.name} (Phòng ${data.currentUser.department})`,
    width / 2,
    148
  );

  // Gold Divider Ribbon
  ctx.strokeStyle = "#facc15";
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(120, 168);
  ctx.lineTo(width - 120, 168);
  ctx.stroke();

  ctx.fillStyle = "#fde047";
  ctx.font = `16px ${fontPrimary}`;
  ctx.fillText("🎄 🎁 🎄", width / 2, 173);

  // 4. SECTION 1: RECIPIENT CARD (Snow White Look)
  const sec1X = 54;
  const sec1Y = 195;
  const sec1W = width - 108;
  const sec1H = 430;

  // Shadow
  ctx.fillStyle = "rgba(0,0,0,0.38)";
  roundRect(sec1X + 4, sec1Y + 4, sec1W, sec1H, 20, true, false);

  // Crisp Snow White Background
  const cardGrad = ctx.createLinearGradient(sec1X, sec1Y, sec1X, sec1Y + sec1H);
  cardGrad.addColorStop(0, "#ffffff");
  cardGrad.addColorStop(1, "#fff5f5");
  ctx.fillStyle = cardGrad;
  roundRect(sec1X, sec1Y, sec1W, sec1H, 20, true, false);

  // Gold frame
  ctx.strokeStyle = "#d97706";
  ctx.lineWidth = 2;
  roundRect(sec1X, sec1Y, sec1W, sec1H, 20, false, true);

  // Section 1 Header Tag
  ctx.fillStyle = "#b91c1c";
  roundRect(sec1X + 24, sec1Y + 18, sec1W - 48, 38, 12, true, false);

  ctx.fillStyle = "#ffffff";
  ctx.font = `800 16px ${fontPrimary}`;
  ctx.textAlign = "center";
  ctx.fillText("🎁 BẠN CHÍNH LÀ ÔNG GIÀ NOEL BÍ MẬT CỦA:", width / 2, sec1Y + 43);

  // Recipient Avatar (Aspect-Ratio Safe Center Crop)
  const avatarCenterX = width / 2;
  const avatarCenterY = sec1Y + 130;
  const avatarRadius = 56;

  let avatarLoaded = false;
  if (data.giftRecipient.avatar) {
    try {
      const img = new Image();
      img.crossOrigin = "anonymous";
      const loadedOk = await new Promise<boolean>((resolve) => {
        const timer = setTimeout(() => resolve(false), 4000);
        img.onload = () => {
          clearTimeout(timer);
          resolve(true);
        };
        img.onerror = () => {
          clearTimeout(timer);
          resolve(false);
        };
        img.src = data.giftRecipient.avatar as string;
      });

      const imgW = img.naturalWidth || img.width;
      const imgH = img.naturalHeight || img.height;

      if (loadedOk && imgW > 0 && imgH > 0) {
        avatarLoaded = true;
        // Compute centered 1:1 square crop (object-cover behavior, slight top bias for portraits)
        const side = Math.min(imgW, imgH);
        const sx = (imgW - side) / 2;
        const sy = imgH > imgW ? (imgH - side) * 0.25 : (imgH - side) / 2;

        ctx.save();
        ctx.beginPath();
        ctx.arc(avatarCenterX, avatarCenterY, avatarRadius, 0, 2 * Math.PI);
        ctx.closePath();
        ctx.clip();
        ctx.drawImage(
          img,
          sx,
          sy,
          side,
          side,
          avatarCenterX - avatarRadius,
          avatarCenterY - avatarRadius,
          avatarRadius * 2,
          avatarRadius * 2
        );
        ctx.restore();
      }
    } catch {
      avatarLoaded = false;
    }
  }

  // Fallback Monogram Avatar if image failed
  if (!avatarLoaded) {
    ctx.fillStyle = "#991b1b";
    ctx.beginPath();
    ctx.arc(avatarCenterX, avatarCenterY, avatarRadius, 0, 2 * Math.PI);
    ctx.fill();

    ctx.fillStyle = "#fef08a";
    ctx.font = `900 44px ${fontPrimary}`;
    ctx.textAlign = "center";
    ctx.fillText(data.giftRecipient.name.charAt(0) || "🎅", avatarCenterX, avatarCenterY + 16);
  }

  // Avatar Gold Ring
  ctx.strokeStyle = "#eab308";
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.arc(avatarCenterX, avatarCenterY, avatarRadius + 2, 0, 2 * Math.PI);
  ctx.stroke();

  // Recipient Name
  ctx.textAlign = "center";
  ctx.font = `900 30px ${fontPrimary}`;
  ctx.fillStyle = "#7f1d1d";
  ctx.fillText(data.giftRecipient.name, width / 2, sec1Y + 225);

  // Recipient Department Badge (auto width based on text)
  const deptLabel = `Phòng ${data.giftRecipient.department}`;
  ctx.font = `800 13px ${fontPrimary}`;
  const deptPillW = Math.max(150, ctx.measureText(deptLabel).width + 44);
  ctx.fillStyle = "#065f46";
  roundRect(width / 2 - deptPillW / 2, sec1Y + 239, deptPillW, 28, 14, true, false);

  ctx.fillStyle = "#d1fae5";
  ctx.fillText(deptLabel, width / 2, sec1Y + 258);

  // Gift Budget & Bio Box (No Wishlist — Free Gift under 200k)
  const noteX = sec1X + 30;
  const noteY = sec1Y + 282;
  const noteW = sec1W - 60;
  const noteH = 124;

  ctx.fillStyle = "#fefce8";
  roundRect(noteX, noteY, noteW, noteH, 14, true, false);
  ctx.strokeStyle = "#fde047";
  ctx.lineWidth = 1.5;
  roundRect(noteX, noteY, noteW, noteH, 14, false, true);

  ctx.textAlign = "left";
  ctx.font = `800 13px ${fontPrimary}`;
  ctx.fillStyle = "#b45309";
  ctx.fillText("🎁 QUÀ TẶNG TỰ DO • GIÁ TRỊ DƯỚI 200.000Đ:", noteX + 18, noteY + 28);

  ctx.font = `600 15px ${fontPrimary}`;
  ctx.fillStyle = "#1c1917";
  const bioLine = data.giftRecipient.bio
    ? `Đôi nét: ${data.giftRecipient.bio} — Tự do chọn món quà bất ngờ dưới 200.000đ nhé!`
    : "Mọi người tự do chọn một món quà bất ngờ, thú vị hoặc thiết thực trong khoảng giá trị dưới 200.000đ dành tặng đồng nghiệp nhé!";
  wrapText(bioLine, noteX + 18, noteY + 56, noteW - 36, 23, 3);

  // 5. SECTION 2: 3 HINTS ABOUT YOUR SANTA
  const sec2X = 54;
  const sec2Y = 645;
  const sec2W = width - 108;
  const sec2H = 370;

  // Shadow
  ctx.fillStyle = "rgba(0,0,0,0.38)";
  roundRect(sec2X + 4, sec2Y + 4, sec2W, sec2H, 20, true, false);

  // Emerald Dark Pine Background
  const hintGrad = ctx.createLinearGradient(sec2X, sec2Y, sec2X, sec2Y + sec2H);
  hintGrad.addColorStop(0, "#064e3b");
  hintGrad.addColorStop(1, "#022c22");
  ctx.fillStyle = hintGrad;
  roundRect(sec2X, sec2Y, sec2W, sec2H, 20, true, false);

  ctx.strokeStyle = "#10b981";
  ctx.lineWidth = 2;
  roundRect(sec2X, sec2Y, sec2W, sec2H, 20, false, true);

  // Section 2 Header Tag
  ctx.fillStyle = "#047857";
  roundRect(sec2X + 24, sec2Y + 18, sec2W - 48, 38, 12, true, false);

  ctx.fillStyle = "#ecfdf5";
  ctx.font = `800 16px ${fontPrimary}`;
  ctx.textAlign = "center";
  ctx.fillText("🕵️‍♂️ 3 MANH MỐI BÍ MẬT VỀ SANTA CỦA BẠN:", width / 2, sec2Y + 43);

  const hints =
    data.santaHints && data.santaHints.length > 0
      ? data.santaHints
      : [
          "Sở thích: Thích những điều bất ngờ và ấm áp",
          "Đặc điểm: Cực kỳ vui tính và nhiệt tình",
          "Ước muốn Noel: Mọi người đều có một mùa lễ thật vui!",
        ];

  let hintBoxY = sec2Y + 70;
  for (let i = 0; i < Math.min(3, hints.length); i++) {
    const hint = hints[i];
    const parts = hint.split(":");
    const title = parts[0]?.trim() || `Manh mối ${i + 1}`;
    const answer = parts.slice(1).join(":")?.trim() || hint;

    // Hint pill box
    ctx.fillStyle = "rgba(0, 0, 0, 0.38)";
    roundRect(sec2X + 24, hintBoxY, sec2W - 48, 74, 12, true, false);
    ctx.strokeStyle = "#059669";
    ctx.lineWidth = 1;
    roundRect(sec2X + 24, hintBoxY, sec2W - 48, 74, 12, false, true);

    // Number circle badge
    ctx.fillStyle = "#f59e0b";
    ctx.beginPath();
    ctx.arc(sec2X + 54, hintBoxY + 37, 16, 0, 2 * Math.PI);
    ctx.fill();

    ctx.fillStyle = "#000000";
    ctx.font = `900 14px ${fontPrimary}`;
    ctx.textAlign = "center";
    ctx.fillText(String(i + 1), sec2X + 54, hintBoxY + 42);

    // Text content with safe width truncation
    ctx.textAlign = "left";
    const textMaxW = sec2W - 110;
    ctx.fillStyle = "#fde047";
    ctx.font = `800 12px ${fontPrimary}`;
    ctx.fillText(truncateToWidth(title.toUpperCase(), textMaxW), sec2X + 82, hintBoxY + 28);

    ctx.fillStyle = "#ffffff";
    ctx.font = `600 15px ${fontPrimary}`;
    ctx.fillText(truncateToWidth(answer, textMaxW), sec2X + 82, hintBoxY + 53);

    hintBoxY += 84;
  }

  // Reminder note inside hints box
  ctx.textAlign = "center";
  ctx.font = `italic 600 13px ${fontPrimary}`;
  ctx.fillStyle = "#a7f3d0";
  ctx.fillText(
    "💡 Hãy giữ kín suy đoán của bạn và chờ đợi đến ngày tiệc bóc quà!",
    width / 2,
    sec2Y + 346
  );

  // 6. FOOTER
  ctx.textAlign = "center";
  ctx.font = `800 14px ${fontPrimary}`;
  ctx.fillStyle = "#fef08a";
  ctx.fillText("⚠️ NHỚ GIỮ BÍ MẬT DANH TÍNH • CHÚC BẠN MÙA GIÁNG SINH AN LÀNH! 🎄", width / 2, 1054);

  ctx.font = `600 12px ${fontPrimary}`;
  ctx.fillStyle = "#e2e8f0";
  ctx.fillText("Secret Santa GLOBAL SAFE 2026 • Mùa Lễ Hội Gắn Kết", width / 2, 1078);

  return canvas.toDataURL("image/png");
}
