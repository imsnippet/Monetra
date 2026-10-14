import { Env } from "../config/env.config";
import { resend } from "../config/resend.config";

type Params = {
  to: string | string[];
  subject: string;
  text: string;
  html: string;
  from: string;
};

export const sendEmail = async ({
  to,
  from,
  subject,
  text,
  html,
}: Params) => {
  if (!Env.RESEND_API_KEY || Env.RESEND_API_KEY.trim() === "") {
    const toStr = Array.isArray(to) ? to.join(", ") : to;
    console.log("\n========================================================");
    console.log("📨 [MONETRA DEV EMAIL SIMULATION]");
    console.log(`To:      ${toStr}`);
    console.log(`From:    ${from}`);
    console.log(`Subject: ${subject}`);
    console.log("--------------------------------------------------------");
    console.log(text || "No plain text content");
    console.log("========================================================\n");
    return { id: `dev-simulated-${Date.now()}` };
  }

  try {
    const { data, error } = await resend.emails.send({
      from,
      to: Array.isArray(to) ? to : [to],
      text,
      subject,
      html,
    });

    if (error) {
      console.warn("Resend email warning:", error.message);
      if (Env.NODE_ENV === "development") {
        console.log(`[DEV MODE FALLBACK] Email would have been delivered to: ${to}`);
        return { id: `dev-simulated-${Date.now()}` };
      }
      throw new Error(error.message);
    }

    console.log("Email sent successfully, id:", data?.id);
    return data;
  } catch (err: any) {
    if (Env.NODE_ENV === "development") {
      console.log(`[DEV MODE CATCH] Simulated email for ${to}: ${err.message}`);
      return { id: `dev-simulated-${Date.now()}` };
    }
    throw err;
  }
};
