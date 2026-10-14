import { getBaseEmailTemplate } from "./base.template";

export const getVerificationEmailTemplate = (params: {
  username: string;
  otp: string;
  expiresInMinutes: number;
}) => {
  const { username, otp, expiresInMinutes } = params;

  const contentRowsHtml = `
    <p style="margin:0 0 16px;font-size:16px;color:#18181b;font-weight:600;">
      Welcome to Monetra, ${username}!
    </p>

    <p style="margin:0 0 16px;font-size:15px;color:#3f3f46;line-height:1.6;">
      Thank you for signing up. To complete your registration and activate your personal finance dashboard, please enter the single-use verification code below:
    </p>

    <div style="margin:24px 0;text-align:center;">
      <div style="
        display:inline-block;
        padding:16px 32px;
        background:#09090b;
        border:1px solid rgba(16,185,129,0.5);
        border-radius:12px;
        font-size:32px;
        font-weight:700;
        letter-spacing:10px;
        color:#34d399;
        font-family:monospace;
      ">
        ${otp}
      </div>
      <p style="margin:8px 0 0;font-size:12px;color:#71717a;">
        This code is valid for the next <strong>${expiresInMinutes} minutes</strong>.
      </p>
    </div>

    <p style="margin:24px 0 0;font-size:13px;color:#71717a;line-height:1.5;">
      If you did not initiate this registration or create an account on Monetra, no action is required and you may safely disregard this message.
    </p>
  `;

  return getBaseEmailTemplate({
    title: "Verify your Monetra account",
    headerTitle: "Account Verification",
    headerSubtitle: "Secure your account",
    headerLabel: "Verification",
    contentRowsHtml,
  });
};
