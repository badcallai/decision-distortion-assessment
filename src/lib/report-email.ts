// The report email's body, in both HTML and plain text. Kept separate from the
// saveLead action so it can be built and tested on its own.

import { type Band, type Profile } from "./scoring";
import { CTA } from "./report-content";

// Band badge colors for the email, mirroring the results screen. Email clients
// need styles inline (they strip <style> blocks and CSS classes), so these are
// raw inline declarations rather than Tailwind classes.
const BAND_EMAIL_STYLES: Record<Band, string> = {
  Low: "background:#dcfce7;color:#166534;",
  Moderate: "background:#fef3c7;color:#92400e;",
  High: "background:#fee2e2;color:#991b1b;",
};

// The company name is free text typed by the respondent, so escape it before
// dropping it into the HTML email.
function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

// The HTML body of the report email: the dominant force called out at the top,
// then all four forces with their band, then the booking CTA. Table-based with
// inline styles so it renders consistently across email clients.
export function reportEmailHtml(profile: Profile, company?: string | null): string {
  const preparedFor = company
    ? `<p style="margin:0 0 20px;color:#18181b;font-size:14px;font-weight:600;">Prepared for ${escapeHtml(company)}</p>`
    : "";

  const rows = profile.results
    .map((result) => {
      const isDominant = result.force === profile.dominant.force;
      return `
        <tr>
          <td style="padding:10px 12px;border-bottom:1px solid #e4e4e7;font-weight:${isDominant ? 700 : 400};">
            ${result.name}${isDominant ? " &middot; dominant" : ""}
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
      Each force is banded by how actively it is distorting judgment in your organization.
    </p>
    ${preparedFor}
    <div style="background:#f4f4f5;border:1px solid #e4e4e7;border-radius:8px;padding:16px;margin-bottom:20px;font-size:14px;line-height:1.5;">
      Your dominant force is
      <strong>${profile.dominant.name}</strong>
      (${profile.dominant.band}) — the area where
      distortion appears most active. Your personalized report is attached.
    </div>

    <table style="width:100%;border-collapse:collapse;font-size:14px;">
      <tbody>
        ${rows}
      </tbody>
    </table>

    <div style="margin:28px 0 0;padding:20px;background:#f4f4f5;border:1px solid #e4e4e7;border-radius:8px;">
      <p style="margin:0 0 16px;font-size:14px;line-height:1.5;">
        ${CTA.talk}
      </p>
      <a href="${CTA.calendly.href}"
         style="display:inline-block;background:#1b2f4e;color:#ffffff;text-decoration:none;font-size:14px;font-weight:600;padding:12px 20px;border-radius:8px;">
        ${CTA.calendly.label} &rarr;
      </a>
    </div>

    <p style="margin:24px 0 0;font-size:14px;">
      <a href="${CTA.lfb.href}" style="color:#2563eb;">${CTA.lfb.url}</a>
      &nbsp;&middot;&nbsp;
      <a href="${CTA.badCall.href}" style="color:#2563eb;">${CTA.badCall.url}</a>
    </p>
    <p style="margin:16px 0 0;color:#a1a1aa;font-size:12px;">LFB Holdings</p>
  </div>`;
}

// Plain-text fallback, sent alongside the HTML for clients that don't render it.
export function reportEmailText(profile: Profile, company?: string | null): string {
  const lines = profile.results
    .map((result) => `- ${result.name}: ${result.band}`)
    .join("\n");
  const preparedFor = company ? `Prepared for ${company}\n\n` : "";
  return `Your Decision Distortion profile

${preparedFor}Your dominant force is ${profile.dominant.name} (${profile.dominant.band}) — the area where distortion appears most active. Your personalized report is attached.

${lines}

${CTA.talk}

${CTA.calendly.label}: ${CTA.calendly.href}

${CTA.lfb.label}: ${CTA.lfb.href}
${CTA.badCall.label}: ${CTA.badCall.href}

LFB Holdings`;
}
