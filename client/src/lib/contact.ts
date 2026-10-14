import { toast } from "sonner";

export const DEVELOPER_EMAIL = "imsnippet@gmail.com";

/**
 * Copies email address to clipboard and attempts to launch default mail app via mailto
 */
export const copyEmailAndOpenMailto = async (
  email: string = DEVELOPER_EMAIL,
  subject: string = "Monetra Inquiry / Feedback",
  e?: React.MouseEvent
): Promise<boolean> => {
  if (e) {
    e.preventDefault();
  }

  let copied = false;

  // 1. Primary: navigator.clipboard API
  if (navigator?.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(email);
      copied = true;
    } catch {
      copied = false;
    }
  }

  // 2. Secondary fallback: execCommand copy for environments blocking clipboard API
  if (!copied) {
    try {
      const textarea = document.createElement("textarea");
      textarea.value = email;
      textarea.style.position = "fixed";
      textarea.style.left = "-9999px";
      textarea.style.top = "0";
      textarea.setAttribute("readonly", "");
      document.body.appendChild(textarea);
      textarea.focus();
      textarea.select();
      copied = document.execCommand("copy");
      document.body.removeChild(textarea);
    } catch {
      copied = false;
    }
  }

  // Feedback to user
  if (copied) {
    toast.success("Email copied to clipboard", {
      description: email,
      duration: 2500,
    });
  } else {
    toast.info("Contact email", {
      description: email,
      duration: 3500,
    });
  }

  // Attempt to invoke mailto link
  try {
    const mailtoUrl = `mailto:${email}?subject=${encodeURIComponent(subject)}`;
    const a = document.createElement("a");
    a.href = mailtoUrl;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  } catch {
    window.location.href = `mailto:${email}?subject=${encodeURIComponent(subject)}`;
  }

  return copied;
};

/**
 * Simply copies email address to clipboard with user toast feedback
 */
export const copyEmailToClipboard = async (
  email: string = DEVELOPER_EMAIL,
  e?: React.MouseEvent
): Promise<boolean> => {
  if (e) {
    e.preventDefault();
    e.stopPropagation();
  }

  let copied = false;

  if (navigator?.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(email);
      copied = true;
    } catch {
      copied = false;
    }
  }

  if (!copied) {
    try {
      const textarea = document.createElement("textarea");
      textarea.value = email;
      textarea.style.position = "fixed";
      textarea.style.left = "-9999px";
      textarea.style.top = "0";
      textarea.setAttribute("readonly", "");
      document.body.appendChild(textarea);
      textarea.focus();
      textarea.select();
      copied = document.execCommand("copy");
      document.body.removeChild(textarea);
    } catch {
      copied = false;
    }
  }

  if (copied) {
    toast.success("Email copied to clipboard!", {
      description: `${email} is ready to paste anywhere.`,
      duration: 3000,
    });
  }

  return copied;
};
