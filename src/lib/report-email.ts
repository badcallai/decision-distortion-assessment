// The report email's body, in both HTML and plain text. Kept separate from the
// saveLead action so it can be built and tested on its own.

import { type Band, type Profile } from "./scoring";

// Band badge colors for the email, mirroring the results screen. Email clients
// need styles inline (they strip <style> blocks and CSS classes), so these are
// raw inline declarations rather than Tailwind classes.
const BAND_EMAIL_STYLES: Record<Band, string> = {
  Low: "background:#dcfce7;color:#166534;",
  Moderate: "background:#fef3c7;color:#92400e;",
  High: "background:#fee2e2;color:#991b1b;",
};

// The HTML body of the report email: the dominant force called out at the top,
// then all four forces with their 0-100 score and band. Table-based with inline
// styles so it renders consistently across email clients.
export function reportEmailHtml(profile: Profile): string {
  const rows = profile.results
    .map((result) => {
      const isDominant = result.force === profile.dominant.force;
      return `
        <tr>
          <td style="padding:10px 12px;border-bottom:1px solid #e4e4e7;font-weight:${isDominant ? 700 : 400};">
            ${result.name}${isDominant ? " &middot; dominant" : ""}
          </td>
          <td style="padding:10px 12px;border-bottom:1px solid #e4e4e7;text-align:right;color:#52525b;white-space:nowrap;">
            ${result.score}/100
          </td>
          <td style="padding:10px 12px;border-bottom:1px solid #e4e4e7;text-align:right;">
            <span style="display:inline-block;padding:2px 10px;border-radius:9999px;font-size:12px;font-weight:600;${BAND_EMAIL_STYLES[result.band]}">
              ${result.band}
            </span>
          </td>
        </tr>`;
    })
    .join("");

  return `
  <div style="font-family:-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;color:#18181b;max-width:560px;margin:0 auto;padding:24px;">
    <h1 style="font-size:20px;margin:0 0 4px;">Your Decision Distortion profile</h1>
    <p style="margin:0 0 20px;color:#52525b;font-size:14px;">
      Higher scores mean the force is more active in your organization.
    </p>

    <div style="background:#f4f4f5;border:1px solid #e4e4e7;border-radius:8px;padding:16px;margin-bottom:20px;font-size:14px;line-height:1.5;">
      Your dominant force is
      <strong>${profile.dominant.name}</strong>
      (${profile.dominant.score}/100, ${profile.dominant.band}) — the area where
      distortion appears most active. Your personalized report is attached.
    </div>

    <table style="width:100%;border-collapse:collapse;font-size:14px;">
      <tbody>
        ${rows}
      </tbody>
    </table>

    <p style="margin:24px 0 0;font-size:14px;">
      <a href="https://lfbholdings.com" style="color:#2563eb;">Learn more or book a conversation &rarr;</a>
    </p>
    <p style="margin:16px 0 0;color:#a1a1aa;font-size:12px;">LFB Holdings</p>
  </div>`;
}

// Plain-text fallback, sent alongside the HTML for clients that don't render it.
export function reportEmailText(profile: Profile): string {
  const lines = profile.results
    .map((result) => `- ${result.name}: ${result.score}/100 (${result.band})`)
    .join("\n");
  return `Your Decision Distortion profile

Your dominant force is ${profile.dominant.name} (${profile.dominant.score}/100, ${profile.dominant.band}) — the area where distortion appears most active. Your personalized report is attached.

${lines}

Learn more or book a conversation: https://lfbholdings.com

LFB Holdings`;
}
