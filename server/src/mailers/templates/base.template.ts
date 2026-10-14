export const getBaseEmailTemplate = (params: {
  title: string;
  headerTitle: string;
  headerSubtitle?: string;
  headerLabel?: string;
  contentRowsHtml: string;
}) => {
  const { title, headerTitle, headerSubtitle, headerLabel, contentRowsHtml } =
    params;

  const currentYear = new Date().getFullYear();

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${title}</title>
</head>

<body style="margin:0;padding:0;background:#f3f4f7;font-family:Arial,sans-serif;">

  <table width="100%" cellpadding="0" cellspacing="0" style="padding:32px 16px;background:#f3f4f7;">
    <tr>
      <td>
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;margin:0 auto;">

          <!-- HEADER -->
          <tr>
            <td style="background:#032612;padding:32px;border-radius:16px 16px 0 0;border-bottom:2px solid rgba(0,230,118,0.25);">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td>
                    <span style="font-size:22px;font-weight:800;letter-spacing:-0.5px;color:#ffffff;display:inline-flex;align-items:center;">
                      Mone<span style="color:#00e676;">tra</span>
                    </span>
                    <span style="display:block;font-size:11px;color:rgba(255,255,255,0.6);margin-top:2px;letter-spacing:0.5px;text-transform:uppercase;">
                      Your Money. Smarter.
                    </span>
                  </td>

                  ${
                    headerLabel
                      ? `
                  <td style="text-align:right;">
                    <span style="display:inline-block;background:rgba(0,230,118,0.15);color:#00e676;font-size:12px;font-weight:700;padding:6px 14px;border-radius:20px;border:1px solid rgba(0,230,118,0.35);letter-spacing:0.3px;">
                      ${headerLabel}
                    </span>
                  </td>`
                      : ""
                  }
                </tr>
              </table>

              <p style="margin:24px 0 0;font-size:24px;font-weight:700;color:#ffffff;line-height:1.25;">
                ${headerTitle}
              </p>

              ${
                headerSubtitle
                  ? `
              <p style="margin:8px 0 0;font-size:14px;color:rgba(255,255,255,0.7);line-height:1.5;">
                ${headerSubtitle}
              </p>`
                  : ""
              }
            </td>
          </tr>

          <!-- CONTENT -->
          <tr>
            <td style="background:#ffffff;padding:36px 32px;border-left:1px solid rgba(0,0,0,0.06);border-right:1px solid rgba(0,0,0,0.06);">
              ${contentRowsHtml}
            </td>
          </tr>

          <!-- FOOTER -->
          <tr>
            <td style="background:#0b1910;padding:22px 32px;border-radius:0 0 16px 16px;border-top:1px solid rgba(255,255,255,0.06);">
              <table width="100%">
                <tr>
                  <td>
                    <p style="margin:0 0 4px;font-size:12px;color:rgba(255,255,255,0.65);font-weight:500;">
                      Monetra Financial Intelligence Platform
                    </p>
                    <p style="margin:0;font-size:11px;color:rgba(255,255,255,0.4);">
                      Architected by Subhan Kashif (<a href="https://github.com/imsnippet" style="color:#00e676;text-decoration:none;">@imsnippet</a>)
                    </p>
                  </td>
                  <td style="text-align:right;vertical-align:middle;">
                    <p style="margin:0;font-size:11px;color:rgba(255,255,255,0.4);">
                      © ${currentYear} Monetra
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>

</body>
</html>`;
};
