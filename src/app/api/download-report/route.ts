import { readFileSync } from "fs";
import path from "path";
import { NextRequest } from "next/server";

const FORCES = ["noise", "bias", "accumulation", "incentive"] as const;
type Force = (typeof FORCES)[number];

// clean client-facing filenames
const DOWNLOAD_NAME: Record<Force, string> = {
  noise: "Noise.pdf",
  bias: "Bias.pdf",
  accumulation: "Accumulation.pdf",
  incentive: "Incentives.pdf",
};

// question id must start with the force's letter, 1-5
const LETTER: Record<Force, string> = {
  noise: "n",
  bias: "b",
  accumulation: "a",
  incentive: "i",
};

export async function GET(req: NextRequest) {
  const force = req.nextUrl.searchParams.get("force") as Force | null;
  const q = (req.nextUrl.searchParams.get("q") ?? "").toLowerCase();
  // ?dl=1 forces a download; otherwise the PDF is served inline for embedding.
  const dl = req.nextUrl.searchParams.get("dl") === "1";

  if (!force || !FORCES.includes(force)) {
    return new Response("Bad force", { status: 400 });
  }
  if (!new RegExp(`^${LETTER[force]}[1-5]$`).test(q)) {
    return new Response("Bad question id", { status: 400 });
  }

  // path is rebuilt from validated tokens only - no client string touches it
  const diskName = `${force} - ${q}.pdf`;
  const filePath = path.join(process.cwd(), "pdfs", diskName);

  // belt-and-suspenders: ensure we're still inside pdfs/
  const pdfsDir = path.join(process.cwd(), "pdfs");
  if (!filePath.startsWith(pdfsDir)) {
    return new Response("Nope", { status: 400 });
  }

  try {
    const file = readFileSync(filePath);
    return new Response(new Uint8Array(file), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `${dl ? "attachment" : "inline"}; filename="${DOWNLOAD_NAME[force]}"`,
        "Cache-Control": "no-store",
      },
    });
  } catch {
    return new Response("Report not found", { status: 404 });
  }
}
