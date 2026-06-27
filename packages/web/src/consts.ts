/**
 * Site-wide metadata — single source of truth for SEO, social cards, and
 * structured data. Consumed by `src/layouts/Layout.astro` and components.
 */
export const SITE = {
  name: "Tentacle Pay",
  title: "Tentacle Pay — Payment infrastructure for AI agents on Sui",
  description:
    "Payment infrastructure for autonomous agents on Sui. x402 micropayments, gasless stablecoins, and one wallet that pays across every chain.",
  url: "https://tentaclepay.com",
  /** 1200×630 social card, served from /public. */
  ogImage: "/og.jpg",
  ogImageAlt:
    "Tentacle Pay — payment infrastructure for autonomous agents on Sui",
  /** Used for twitter:site and twitter:creator. */
  twitter: "@tentaclepay",
  locale: "en_US",
  /** `.dark` --background token from global.css (abyss black). */
  themeColor: "#0b080c",
} as const;

/**
 * FAQ — single source of truth for the visible <Faq> section *and* the
 * FAQPage JSON-LD in `Layout.astro`. Google requires FAQ schema to match
 * on-page content, so both read from here. Answers are self-contained
 * (~40–60 words) so AI answer engines can cite them verbatim, written
 * around the queries we want to rank for ("x402 on Sui", "agentic payments
 * on Sui", "how do AI agents pay"). Facts mirror docs.tentaclepay.com.
 */
export const FAQ = [
  {
    q: "How do AI agents pay for APIs with x402?",
    a: "When an agent hits a paid endpoint, the server returns HTTP 402 with the price, network, token, and recipient. The agent signs a Sui payment, retries the request, and the facilitator verifies and settles it for a 200 OK. The agent never manages gas, nonces, or RPC calls — the SDK and facilitator handle it.",
  },
  {
    q: "Are x402 payments on Sui gasless?",
    a: "Yes. Sui makes stablecoin transfers gasless natively, but only above a $0.01 minimum. The Tentacle Pay facilitator sponsors gas for everything that rule leaves out — sub-cent stablecoin payments and any non-stablecoin coin — so no agent transaction ever fails on gas.",
  },
  {
    q: "What are agentic payments?",
    a: "Agentic payments let autonomous AI agents pay and get paid at machine speed, without a human approving each transaction. Tentacle Pay gives an agent a wallet it controls (tpay) with spending rules it can't break, an x402 rail to pay any API over HTTP, and one Sui balance it can spend across chains.",
  },
  {
    q: "How do I accept x402 payments on Sui as a seller?",
    a: "Run x402 middleware on your API, MCP server, or agent and point it at facilitator.tentaclepay.com. The endpoint returns a 402 with your USD price; the facilitator verifies the signed payment and settles it on Sui straight to your address. It never custodies funds, and it's free to use.",
  },
  {
    q: "Can an agent pay across other chains from a Sui wallet?",
    a: "Yes. The agent keeps one Sui wallet and pays USDC into the Tentacle Pay Move package, which asks a dWallet — a key split across Ika's 2PC-MPC network — to sign the destination-chain payment. One wallet, one balance, any chain. Cross-chain settlement to EVM destinations is live on testnet.",
  },
] as const;

/** External destinations referenced across the site. */
export const LINKS = {
  github: "https://github.com/tentaclepay",
  x: "https://x.com/tentaclepay",
  docs: "https://docs.tentaclepay.com",
  faq: "https://docs.tentaclepay.com/faq",
  x402Overview: "https://docs.tentaclepay.com/x402/overview",
  agentQuickstart: "https://docs.tentaclepay.com/x402/quickstart-for-agents",
  sellerQuickstart: "https://docs.tentaclepay.com/x402/quickstart-for-sellers",
  crossChain: "https://docs.tentaclepay.com/cross-chain/overview",
  walletSetup: "https://docs.tentaclepay.com/wallet/get-started",
} as const;
