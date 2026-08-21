"use strict";

const sample = {
  series: "01",
  title: "A covariant energy density functional derived from chiral nuclear forces at NLO",
  author: "Bowen Hu",
  time: "FRIDAY · Aug. 15, 2026\n9:00 AM",
  location: "B331",
  abstract: "In this work, we develop a covariant energy density functional (EDF) derived from relativistic chiral nuclear forces at next-to-leading order. The resulting EDF provides a description of the saturation properties of nuclear matter and the bulk properties of finite nuclei that is comparable in quality to existing state-of-the-art functionals. At the same time, its foundation in chiral effective field theory enables a systematic quantification of theoretical uncertainties through the underlying power-counting scheme."
};

const ids = ["title", "series", "author", "time", "location", "abstract"];
const fields = Object.fromEntries(ids.map(id => [id, document.getElementById(id)]));
const picker = document.getElementById("time-picker");
const abstractFontSizeInput = document.getElementById("abstract-font-size");
const abstractFontSizeValue = document.getElementById("abstract-font-size-value");
const canvas = document.getElementById("poster");
const ctx = canvas.getContext("2d");
const downloadLink = document.getElementById("download");
let downloadUrl = "";
let downloadGeneration = 0;
const qrImage = new Image();
qrImage.src = "ntg-qr.png";
qrImage.addEventListener("load", drawPoster);

function canvasFont(size, weight = 400, family = "Arial") {
  return `${weight} ${size}px ${family}, "Microsoft YaHei", sans-serif`;
}

function mathText(value) {
  const superscripts = {"0":"⁰","1":"¹","2":"²","3":"³","4":"⁴","5":"⁵","6":"⁶","7":"⁷","8":"⁸","9":"⁹","+":"⁺","-":"⁻","=":"⁼","(":"⁽",")":"⁾",n:"ⁿ",i:"ⁱ"};
  const subscripts = {"0":"₀","1":"₁","2":"₂","3":"₃","4":"₄","5":"₅","6":"₆","7":"₇","8":"₈","9":"₉","+":"₊","-":"₋","=":"₌","(":"₍",")":"₎",n:"ₙ"};
  return value.replace(/\$([^$]+)\$/g, "$1").replace(/\^\{([^}]+)\}|\^([A-Za-z0-9+\-=()]+)/g, (_, group, single) => Array.from(group || single).map(ch => superscripts[ch] || ch).join("")).replace(/_\{([^}]+)\}|_([A-Za-z0-9+\-=()]+)/g, (_, group, single) => Array.from(group || single).map(ch => subscripts[ch] || ch).join(""));
}

function splitLines(text, maxWidth) {
  const result = [];
  for (const paragraph of mathText(text || " ").split("\n")) {
    const cjk = /[\u3400-\u9fff]/.test(paragraph);
    const tokens = cjk ? Array.from(paragraph) : paragraph.split(/\s+/);
    let line = "";
    for (const token of tokens) {
      const separator = cjk || !line ? "" : " ";
      const trial = line + separator + token;
      if (line && ctx.measureText(trial).width > maxWidth) {
        result.push(line);
        line = token;
      } else {
        line = trial;
      }
    }
    result.push(line || " ");
  }
  return result;
}

function fitLines(text, maxWidth, maxLines, startSize, minSize, weight) {
  let size = startSize;
  let lines = [];
  do {
    ctx.font = canvasFont(size, weight);
    lines = splitLines(text, maxWidth);
    if (lines.length <= maxLines) break;
    size -= 2;
  } while (size >= minSize);
  return { size, lines: lines.slice(0, maxLines) };
}

const abstractAssetCache = new Map();

function getAbstractAsset(text, size, width, onReady) {
  const key = `${size}|${width}|${text}`;
  if (abstractAssetCache.has(key)) return abstractAssetCache.get(key);
  const root = document.createElement("div");
  root.setAttribute("xmlns", "http://www.w3.org/1999/xhtml");
  Object.assign(root.style, { width: `${width}px`, color: "#183b35", font: canvasFont(size, 400), lineHeight: "1.38", whiteSpace: "pre-wrap", overflowWrap: "anywhere" });
  const source = text || "—";
  const pattern = /(\$\$[\s\S]+?\$\$|\$[^$\n]+?\$)/g;
  let cursor = 0;
  for (const match of source.matchAll(pattern)) {
    if (match.index > cursor) root.append(document.createTextNode(source.slice(cursor, match.index)));
    const raw = match[0];
    const displayMode = raw.startsWith("$$");
    const formula = raw.slice(displayMode ? 2 : 1, displayMode ? -2 : -1);
    const holder = document.createElement(displayMode ? "div" : "span");
    if (displayMode) Object.assign(holder.style, { textAlign: "center", margin: `${size * .3}px 0` });
    try { holder.innerHTML = katex.renderToString(formula, { displayMode, throwOnError: false, output: "mathml" }); }
    catch { holder.textContent = raw; }
    root.append(holder);
    cursor = match.index + raw.length;
  }
  root.append(document.createTextNode(source.slice(cursor)));
  Object.assign(root.style, { position: "fixed", left: "-10000px", top: "0" });
  document.body.append(root);
  const height = Math.max(Math.ceil(root.scrollHeight + 8), Math.ceil(size * 1.5));
  root.style.position = "static";
  root.style.left = "auto";
  const serialized = new XMLSerializer().serializeToString(root);
  root.remove();
  const asset = { height, image: null, loading: true };
  abstractAssetCache.set(key, asset);
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}"><foreignObject width="100%" height="100%">${serialized}</foreignObject></svg>`;
  const image = new Image();
  image.onload = () => { asset.image = image; asset.loading = false; onReady(); };
  image.onerror = () => { asset.loading = false; onReady(); };
  image.src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
  return asset;
}

function values() {
  return Object.fromEntries(ids.map(id => [id, fields[id].value]));
}

function refreshDownloadLink() {
  const generation = ++downloadGeneration;
  canvas.toBlob(blob => {
    if (!blob || generation !== downloadGeneration) return;
    const previousUrl = downloadUrl;
    downloadUrl = URL.createObjectURL(blob);
    const safeSeries = fields.series.value.trim().replace(/[<>:"/\\|?*\u0000-\u001f]/g, "-") || "未设置";
    downloadLink.href = downloadUrl;
    downloadLink.download = `poster_${safeSeries}.png`;
    if (previousUrl) URL.revokeObjectURL(previousUrl);
  }, "image/png");
}

function drawPoster() {
  const data = values();
  const W = 1654, baseH = 2339;
  const green = "#08735f", darkGreen = "#0b4038", navy = "#244f89";
  const gold = "#bda04a", pale = "#e8f2f0", cream = "#f6f0de";

  const abstractFontSize = Math.min(48, Math.max(22, Number(abstractFontSizeInput.value) || 34));
  const abstractLineHeight = abstractFontSize * 1.38;
  ctx.font = canvasFont(abstractFontSize, 400);
  const abstractLines = splitLines(data.abstract || "—", 1465);
  const abstractAsset = getAbstractAsset(data.abstract || "—", abstractFontSize, 1465, () => setTimeout(drawPoster, 0));
  const abstractH = Math.max(477, 118 + abstractAsset.height);
  const extraHeight = abstractH - 477;
  const welcomeY = 1535 + extraHeight;
  const baseFooterY = 2275;
  const baseContactTop = baseFooterY - 190;
  const contactShift = Math.max(0, welcomeY + 80 - baseContactTop);
  const H = baseH + contactShift;
  if (canvas.width !== W) canvas.width = W;
  if (canvas.height !== H) canvas.height = H;

  ctx.clearRect(0, 0, W, H);
  ctx.fillStyle = "#fff";
  ctx.fillRect(0, 0, W, H);

  ctx.fillStyle = green;
  ctx.fillRect(60, 55, 1534, 136);
  ctx.fillStyle = "#fff";
  ctx.textAlign = "left";
  ctx.font = canvasFont(31, 600);
  ctx.fillText("中山大学物理与天文学院", 90, 120);
  ctx.font = canvasFont(17, 600);
  ctx.fillText("SCHOOL OF PHYSICS AND ASTRONOMY · SUN YAT-SEN UNIVERSITY", 89, 154);
  ctx.textAlign = "right";
  ctx.font = canvasFont(49, 800);
  const series = data.series.trim() || "—";
  ctx.fillText(`SERIES ${series}`, 1560, 124);
  ctx.font = canvasFont(23, 600);
  ctx.fillText(`第 ${series} 期`, 1560, 165);

  ctx.textAlign = "center";
  ctx.fillStyle = darkGreen;
  ctx.font = canvasFont(38, 500);
  ctx.fillText("核理论课题组研究进展报告", W / 2, 286);
  ctx.fillStyle = "#209c8c";
  ctx.font = canvasFont(18, 700);
  ctx.fillText("NUCLEAR THEORY GROUP · RESEARCH PROGRESS SEMINAR", W / 2, 326);
  ctx.fillStyle = gold;
  ctx.fillRect(59, 334, 1536, 4);

  const title = fitLines(data.title, 1450, 3, 78, 50, 800);
  const titleLineHeight = title.size * 1.38;
  const titleY = 535 - title.lines.length * titleLineHeight / 2 + title.size * .8;
  ctx.font = canvasFont(title.size, 800);
  ctx.fillStyle = navy;
  title.lines.forEach((line, i) => ctx.fillText(line, W / 2, titleY + i * titleLineHeight));

  const cardY = 704, cardH = 151;
  ctx.fillStyle = darkGreen;
  ctx.fillRect(60, cardY, 488, cardH);
  ctx.fillRect(1155, cardY, 439, cardH);
  ctx.fillStyle = cream;
  ctx.fillRect(548, cardY, 607, cardH);
  ctx.fillStyle = "#bce5de";
  ctx.font = canvasFont(16, 700);
  ctx.fillText("SPEAKER", 304, cardY + 52);
  ctx.fillText("LOCATION", 1375, cardY + 52);
  ctx.fillStyle = "#fff";
  ctx.font = canvasFont(42, 700);
  ctx.fillText(data.author || "—", 304, cardY + 105);
  ctx.fillText(data.location || "—", 1375, cardY + 105);

  const timeParts = (data.time || "—").split("\n").filter(Boolean);
  ctx.fillStyle = "#ef2019";
  ctx.font = canvasFont(timeParts.length > 1 ? 29 : 34, 800);
  ctx.fillText(timeParts[0] || "—", 851.5, cardY + (timeParts.length > 1 ? 55 : 91));
  if (timeParts.length > 1) {
    ctx.fillStyle = darkGreen;
    ctx.font = canvasFont(43, 800);
    ctx.fillText(timeParts.slice(1).join(" "), 851.5, cardY + 115);
  }

  const abstractY = 1001;
  ctx.fillStyle = green;
  ctx.fillRect(60, abstractY, 1534, 4);
  ctx.fillStyle = pale;
  ctx.fillRect(60, abstractY + 4, 1534, abstractH - 4);
  ctx.textAlign = "left";
  ctx.fillStyle = green;
  ctx.font = canvasFont(27, 800);
  ctx.fillText("ABSTRACT", 94, abstractY + 56);
  ctx.fillStyle = "#183b35";
  ctx.font = canvasFont(abstractFontSize, 400);
  if (abstractAsset.image) ctx.drawImage(abstractAsset.image, 94, abstractY + 88, 1465, abstractAsset.height);
  else abstractLines.forEach((line, i) => ctx.fillText(line, 94, abstractY + 110 + i * abstractLineHeight));

  const infoOffset = extraHeight;
  ctx.fillStyle = gold;
  ctx.fillRect(60, 1495 + infoOffset, 1534, 4);
  ctx.textAlign = "center";
  ctx.fillStyle = green;
  ctx.font = canvasFont(24, 800);
  ctx.fillText("ALL INTERESTED COLLEAGUES AND STUDENTS ARE WARMLY WELCOME TO ATTEND.", W / 2, 1535 + infoOffset);
  const footerY = baseFooterY + contactShift;
  const infoTextX = W / 2;
  ctx.textAlign = "center";
  ctx.fillStyle = "#6a7976";
  ctx.font = canvasFont(35, 700, "Georgia");
  ctx.fillText("Nuclear Theory Group", infoTextX, footerY - 116);
  ctx.font = canvasFont(31, 700, "Georgia");
  ctx.fillText("https://ntg.usys.ac.cn/index.html", infoTextX, footerY - 66);
  if (qrImage.complete && qrImage.naturalWidth > 0) {
    const qrSize = 170, qrX = 1380, qrY = footerY - 190;
    ctx.fillStyle = "#fff";
    ctx.fillRect(qrX - 8, qrY - 8, qrSize + 16, qrSize + 16);
    ctx.drawImage(qrImage, qrX, qrY, qrSize, qrSize);
  }
  ctx.fillStyle = gold;
  ctx.fillRect(60, footerY, 1534, 3);
  ctx.fillStyle = green;
  ctx.fillRect(60, footerY + 3, 1534, 46);
  ctx.fillStyle = "#fff";
  ctx.font = canvasFont(16, 700);
  ctx.textAlign = "left";
  ctx.fillText("NUCLEAR THEORY GROUP  ·  SCHOOL OF PHYSICS AND ASTRONOMY", 86, footerY + 33);
  ctx.textAlign = "right";
  ctx.fillText("SUN YAT-SEN UNIVERSITY", 1565, footerY + 33);
  refreshDownloadLink();
}

function fillExample() {
  ids.forEach(id => { fields[id].value = sample[id]; });
  picker.value = "2026-08-15T09:00";
  abstractFontSizeInput.value = "34";
  abstractFontSizeValue.value = "34 px";
  drawPoster();
}

ids.forEach(id => fields[id].addEventListener("input", drawPoster));
abstractFontSizeInput.addEventListener("input", () => {
  abstractFontSizeValue.value = `${abstractFontSizeInput.value} px`;
  drawPoster();
});
picker.addEventListener("change", event => {
  const value = event.target.value;
  if (!value) return;
  const [date, time] = value.split("T");
  const [year, month, day] = date.split("-").map(Number);
  fields.time.value = `${year}年${month}月${day}日\n${time}`;
  drawPoster();
});
document.getElementById("fill-example").addEventListener("click", fillExample);
downloadLink.addEventListener("click", event => {
  event.preventDefault();
  const trigger = url => {
    const link = document.createElement("a");
    link.href = url;
    const safeSeries = fields.series.value.trim().replace(/[<>:"/\\|?*\u0000-\u001f]/g, "-") || "未设置";
    link.download = `poster_${safeSeries}.png`;
    link.style.display = "none";
    document.body.appendChild(link);
    link.click();
    link.remove();
  };
  if (downloadUrl) {
    trigger(downloadUrl);
    const label = document.getElementById("download-label");
    label.textContent = "已保存到下载文件夹";
    setTimeout(() => { label.textContent = "下载高清 PNG"; }, 1800);
    return;
  }
  canvas.toBlob(blob => {
    if (!blob) return;
    const url = URL.createObjectURL(blob);
    trigger(url);
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
    const label = document.getElementById("download-label");
    label.textContent = "已保存到下载文件夹";
    setTimeout(() => { label.textContent = "下载高清 PNG"; }, 1800);
  }, "image/png");
});

ids.forEach(id => { fields[id].value = ""; });
picker.value = "";
drawPoster();
