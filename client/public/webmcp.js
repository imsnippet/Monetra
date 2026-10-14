/**
 * VoiceyBill WebMCP tools.
 *
 * Exposes VoiceyBill's key in-page actions to AI agents through the WebMCP
 * browser API (https://webmachinelearning.github.io/webmcp/). Tools are
 * registered with `navigator.modelContext` when an agent-capable browser
 * provides it. This runs entirely client-side and only navigates within the
 * app that the signed-in user already has open — it never exposes credentials.
 */
(function () {
  "use strict";

  var ORIGIN = window.location.origin;

  function go(path) {
    window.location.assign(ORIGIN + path);
    return { navigated_to: path };
  }

  var TOOLS = [
    {
      name: "voiceybill_open_section",
      description:
        "Navigate the VoiceyBill app to one of its main sections: overview, transactions, budget, reports, or settings.",
      inputSchema: {
        type: "object",
        properties: {
          section: {
            type: "string",
            enum: ["overview", "transactions", "budget", "reports", "settings"],
            description: "Which section to open.",
          },
        },
        required: ["section"],
      },
      execute: async function (input) {
        var args = (input && input.arguments) || input || {};
        var map = {
          overview: "/overview",
          transactions: "/transactions",
          budget: "/budget",
          reports: "/reports",
          settings: "/settings",
        };
        var path = map[args.section] || "/overview";
        var result = go(path);
        return {
          content: [{ type: "text", text: "Opened " + args.section + " (" + path + ")." }],
          structuredContent: result,
        };
      },
    },
    {
      name: "voiceybill_add_transaction",
      description:
        "Open the VoiceyBill transactions page ready to add a new income or expense entry.",
      inputSchema: {
        type: "object",
        properties: {
          type: {
            type: "string",
            enum: ["income", "expense"],
            description: "Whether to add income or an expense.",
          },
        },
      },
      execute: async function (input) {
        var args = (input && input.arguments) || input || {};
        var query = args.type ? "?add=true&type=" + encodeURIComponent(args.type) : "?add=true";
        var result = go("/transactions" + query);
        return {
          content: [{ type: "text", text: "Opened the add-transaction view." }],
          structuredContent: result,
        };
      },
    },
    {
      name: "voiceybill_app_info",
      description:
        "Return a short description of VoiceyBill, its capabilities, and where an agent can authenticate.",
      inputSchema: { type: "object", properties: {} },
      execute: async function () {
        var info = {
          name: "VoiceyBill",
          description:
            "Personal financial platform: track income and expenses with voice input, AI receipt scanning, analytics, and scheduled reports.",
          api: "https://voiceybill-server.vercel.app/api",
          auth_doc: ORIGIN + "/auth.md",
          mcp_server_card: ORIGIN + "/.well-known/mcp/server-card.json",
        };
        return {
          content: [{ type: "text", text: JSON.stringify(info) }],
          structuredContent: info,
        };
      },
    },
  ];

  var registered = false;

  function register() {
    if (registered) return;
    var mc = navigator.modelContext;
    if (!mc) return;

    // Preferred API: provideContext({ tools }).
    if (typeof mc.provideContext === "function") {
      mc.provideContext({ tools: TOOLS });
      registered = true;
      return;
    }

    // Fallback API: registerTool(tool) per tool.
    if (typeof mc.registerTool === "function") {
      TOOLS.forEach(function (tool) {
        mc.registerTool(tool);
      });
      registered = true;
    }
  }

  register();

  // Some agent runtimes inject navigator.modelContext after initial scripts run.
  if (!registered) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", register, { once: true });
    }
    window.addEventListener("load", register, { once: true });
  }
})();
