export interface CardExportData {
  currentUser: {
    name: string;
    department: string;
  };
  giftRecipient: {
    name: string;
    department: string;
    avatar?: string;
    wishlist?: string;
    bio?: string;
  };
  santaHints: string[];
}

/**
 * Generates a high-resolution, rock-solid Christmas Postcard PNG using HTML5 Canvas.
 * Solves all CSS breakage, CORS, flex layout, and mobile rendering issues.
 */
export async function generateSecretSantaCard(data: CardExportData): Promise<string> {
  const width = 800;
  const height = 1120;
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const rawCtx = canvas.getContext("2d");

  if (!rawCtx) {
    throw new Error("Canvas context is not supported");
  }
  const ctx: CanvasRenderingContext2D = rawCtx;

  // Helper: Draw rounded rectangle
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

  // Helper: Wrap text
  function wrapText(
    text: string,
    x: number,
    y: number,
    maxWidth: number,
    lineHeight: number,
    maxLines = 4
  ) {
    const words = text.split(" ");
    let line = "";
    let linesDrawn = 0;

    for (let n = 0; n < words.length; n++) {
      const testLine = line + words[n] + " ";
      const metrics = ctx.measureText(testLine);
      const testWidth = metrics.width;
      if (testWidth > maxWidth && n > 0) {
        ctx.fillText(line.trim(), x, y);
        line = words[n] + " ";
        y += lineHeight;
        linesDrawn++;
        if (linesDrawn >= maxLines - 1) {
          ctx.fillText((line + words.slice(n + 1).join(" ")).slice(0, 38) + "...", x, y);
          return y + lineHeight;
        }
      } else {
        line = testLine;
      }
    }
    ctx.fillText(line.trim(), x, y);
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
  ctx.font = "24px system-ui";
  ctx.fillStyle = "#facc15";
  ctx.textAlign = "center";
  ctx.fillText("❄", 48, 54);
  ctx.fillText("❄", width - 48, 54);
  ctx.fillText("❄", 48, height - 42);
  ctx.fillText("❄", width - 48, height - 42);

  // 3. Top Header
  ctx.textAlign = "center";
  ctx.font = "bold 15px system-ui";
  ctx.fillStyle = "#fde047";
  ctx.fillText("✦ TOP SECRET MISSION • NORTH POLE SPECIAL DELIVERY ✦", width / 2, 72);

  ctx.font = "bold 34px Georgia, serif";
  ctx.fillStyle = "#ffffff";
  ctx.shadowColor = "rgba(234, 179, 8, 0.6)";
  ctx.shadowBlur = 12;
  ctx.fillText("THẺ NHIỆM VỤ SECRET SANTA 🎅", width / 2, 116);
  ctx.shadowBlur = 0;

  // Personalized subtitle
  ctx.font = "600 16px system-ui";
  ctx.fillStyle = "#fef08a";
  ctx.fillText(
    `Thành viên: ${data.currentUser.name} (Phòng ${data.currentUser.department})`,
    width / 2,
    148
  );

  // Gold Divider Ribbon
  ctx.strokeStyle = "#ca8a04";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(120, 168);
  ctx.lineTo(width - 120, 168);
  ctx.stroke();

  ctx.fillStyle = "#fde047";
  ctx.font = "16px system-ui";
  ctx.fillText("🎄 🎁 🎄", width / 2, 173);

  // 4. SECTION 1: RECIPIENT CARD (Cream Parchment Look)
  const sec1X = 54;
  const sec1Y = 195;
  const sec1W = width - 108;
  const sec1H = 430;

  // Shadow
  ctx.fillStyle = "rgba(0,0,0,0.5)";
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
  ctx.font = "bold 16px system-ui";
  ctx.textAlign = "center";
  ctx.fillText("🎁 BẠN CHÍNH LÀ ÔNG GIÀ NOEL BÍ MẬT CỦA:", width / 2, sec1Y + 43);

  // Recipient Avatar
  const avatarCenterX = width / 2;
  const avatarCenterY = sec1Y + 125;
  const avatarRadius = 52;

  // Try loading avatar image with CORS fallback
  let avatarLoaded = false;
  if (data.giftRecipient.avatar) {
    try {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.src = data.giftRecipient.avatar;
      await new Promise((resolve) => {
        img.onload = () => {
          avatarLoaded = true;
          resolve(true);
        };
        img.onerror = () => resolve(false);
        setTimeout(resolve, 800); // 800ms timeout
      });

      if (avatarLoaded) {
        ctx.save();
        ctx.beginPath();
        ctx.arc(avatarCenterX, avatarCenterY, avatarRadius, 0, 2 * Math.PI);
        ctx.closePath();
        ctx.clip();
        ctx.drawImage(
          img,
          avatarCenterX - avatarRadius,
          avatarCenterY - avatarRadius,
          avatarRadius * 2,
          avatarRadius * 2
        );
        ctx.restore();
      }
    } catch (e) {
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
    ctx.font = "bold 44px Georgia, serif";
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
  ctx.font = "bold 30px Georgia, serif";
  ctx.fillStyle = "#7f1d1d";
  ctx.fillText(data.giftRecipient.name, width / 2, sec1Y + 222);

  // Recipient Department Badge
  ctx.fillStyle = "#065f46";
  roundRect(width / 2 - 90, sec1Y + 236, 180, 28, 14, true, false);

  ctx.fillStyle = "#a7f3d0";
  ctx.font = "bold 13px system-ui";
  ctx.fillText(`Phòng ${data.giftRecipient.department}`, width / 2, sec1Y + 255);

  // Wishlist Box
  const wishX = sec1X + 30;
  const wishY = sec1Y + 276;
  const wishW = sec1W - 60;
  const wishH = 126;

  ctx.fillStyle = "#fefce8";
  roundRect(wishX, wishY, wishW, wishH, 14, true, false);
  ctx.strokeStyle = "#fde047";
  ctx.lineWidth = 1.5;
  roundRect(wishX, wishY, wishW, wishH, 14, false, true);

  ctx.textAlign = "left";
  ctx.font = "bold 13px system-ui";
  ctx.fillStyle = "#b45309";
  ctx.fillText("❤️ Wishlist / Món quà mong muốn:", wishX + 16, wishY + 25);

  ctx.font = "italic 15px Georgia, serif";
  ctx.fillStyle = "#1c1917";
  const wishlistText =
    data.giftRecipient.wishlist ||
    "Chưa cập nhật sở thích cụ thể, hãy chọn một món quà thật bất ngờ nhé!";
  wrapText(`"${wishlistText}"`, wishX + 16, wishY + 54, wishW - 32, 22, 3);

  // 5. SECTION 2: 3 HINTS ABOUT YOUR SANTA
  const sec2X = 54;
  const sec2Y = 645;
  const sec2W = width - 108;
  const sec2H = 370;

  // Shadow
  ctx.fillStyle = "rgba(0,0,0,0.5)";
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
  ctx.font = "bold 16px system-ui";
  ctx.textAlign = "center";
  ctx.fillText("🕵️‍♂️ 3 MANH MỐI BÍ MẬT VỀ SANTA CỦA BẠN:", width / 2, sec2Y + 43);

  // Render 3 Hint Boxes
  const hints = data.santaHints && data.santaHints.length > 0
    ? data.santaHints
    : [
        "Sở thích: Thích những điều bất ngờ và ấm áp",
        "Đặc điểm: Cực kỳ vui tính và nhiệt tình",
        "Ước muốn Noel: Mọi người đều có một mùa lễ thật vui!"
      ];

  let hintBoxY = sec2Y + 70;
  for (let i = 0; i < Math.min(3, hints.length); i++) {
    const hint = hints[i];
    const parts = hint.split(":");
    const title = parts[0]?.trim() || `Manh mối ${i + 1}`;
    const answer = parts.slice(1).join(":")?.trim() || hint;

    // Hint pill box
    ctx.fillStyle = "rgba(0, 0, 0, 0.45)";
    roundRect(sec2X + 24, hintBoxY, sec2W - 48, 72, 12, true, false);
    ctx.strokeStyle = "#059669";
    ctx.lineWidth = 1;
    roundRect(sec2X + 24, hintBoxY, sec2W - 48, 72, 12, false, true);

    // Number circle badge
    ctx.fillStyle = "#f59e0b";
    ctx.beginPath();
    ctx.arc(sec2X + 54, hintBoxY + 36, 16, 0, 2 * Math.PI);
    ctx.fill();

    ctx.fillStyle = "#000000";
    ctx.font = "bold 14px system-ui";
    ctx.textAlign = "center";
    ctx.fillText(String(i + 1), sec2X + 54, hintBoxY + 41);

    // Text content
    ctx.textAlign = "left";
    ctx.fillStyle = "#fde047";
    ctx.font = "bold 12px system-ui";
    ctx.fillText(title.toUpperCase(), sec2X + 82, hintBoxY + 28);

    ctx.fillStyle = "#ffffff";
    ctx.font = "600 15px system-ui";
    ctx.fillText(answer.length > 55 ? answer.slice(0, 53) + "..." : answer, sec2X + 82, hintBoxY + 52);

    hintBoxY += 82;
  }

  // Reminder note inside hints box
  ctx.textAlign = "center";
  ctx.font = "italic 13px system-ui";
  ctx.fillStyle = "#a7f3d0";
  ctx.fillText("💡 Hãy giữ kín suy đoán của bạn và chờ đợi đến ngày tiệc bóc quà!", width / 2, sec2Y + 342);

  // 6. FOOTER
  ctx.textAlign = "center";
  ctx.font = "bold 14px system-ui";
  ctx.fillStyle = "#fef08a";
  ctx.fillText("⚠️ NHỚ GIỮ BÍ MẬT DANH TÍNH • CHÚC BẠN MÙA GIÁNG SINH AN LÀNH! 🎄", width / 2, 1055);

  ctx.font = "12px system-ui";
  ctx.fillStyle = "#94a3b8";
  ctx.fillText("Secret Santa Công Ty 2026 • Design by North Pole Express", width / 2, 1080);

  return canvas.toDataURL("image/png");
}
