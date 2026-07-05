// Builds a spare one-page transmittal cover and prepends it to the selected
// whitepaper PDF — entirely in memory, never touching the files on disk. Used
// only when the respondent provided a company / engagement name. Pure pdf-lib,
// so it has no native dependencies and runs cleanly in Vercel's environment.

import { PDFDocument, StandardFonts, rgb, type PDFFont, type Color } from "pdf-lib";
import fs from "fs";
import path from "path";

// The standard PDF fonts use WinAnsi encoding, which can't draw smart quotes,
// em dashes, and similar characters. Swap the common ones to plain ASCII so a
// fancy character in a company name doesn't force us to drop the cover page.
function toWinAnsiSafe(text: string): string {
  return text
    .replace(/[‘’]/g, "'")
    .replace(/[“”]/g, '"')
    .replace(/[–—]/g, "-");
}

export async function prependCoverPage(
  whitepaper: Buffer,
  companyName: string,
): Promise<Buffer> {
  const doc = await PDFDocument.create();
  const regular = await doc.embedFont(StandardFonts.Helvetica);

  // US Letter, portrait.
  const pageWidth = 612;
  const pageHeight = 792;
  const page = doc.addPage([pageWidth, pageHeight]);

  const navy = rgb(0.106, 0.149, 0.231); // #1b263b
  const muted = rgb(0.357, 0.42, 0.498); // #5b6b7f

  const generatedOn = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  // Draw one line horizontally centered on the page at the given y.
  const drawCentered = (
    text: string,
    font: PDFFont,
    size: number,
    y: number,
    color: Color,
  ) => {
    const safe = toWinAnsiSafe(text);
    const width = font.widthOfTextAtSize(safe, size);
    page.drawText(safe, { x: (pageWidth - width) / 2, y, size, font, color });
  };

  // Logo centered near the top, then the document title, who it's for, and the
  // date. The logo carries the "LFB Holdings" wordmark, so no separate text line.
  const logoBytes = fs.readFileSync(
    path.join(process.cwd(), "public", "logo.png"),
  );
  const logo = await doc.embedPng(logoBytes);
  const logoWidth = 200;
  const logoHeight = (logo.height / logo.width) * logoWidth;
  page.drawImage(logo, {
    x: (pageWidth - logoWidth) / 2,
    y: 500,
    width: logoWidth,
    height: logoHeight,
  });

  drawCentered("Decision Distortion Assessment", regular, 16, 458, muted);
  drawCentered(`Prepared for ${companyName}`, regular, 14, 420, navy);
  drawCentered(generatedOn, regular, 11, 396, muted);

  // Append the whitepaper's pages after the cover so the cover is page 1.
  const whitepaperDoc = await PDFDocument.load(whitepaper);
  const pages = await doc.copyPages(
    whitepaperDoc,
    whitepaperDoc.getPageIndices(),
  );
  pages.forEach((appended) => doc.addPage(appended));

  return Buffer.from(await doc.save());
}
