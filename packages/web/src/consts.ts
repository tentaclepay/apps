/**
 * Site-wide metadata — single source of truth for SEO, social cards, and
 * structured data. Consumed by `src/layouts/Layout.astro` and components.
 */
export const SITE = {
  name: "Tentacle Pay",
  title: "Tentacle Pay — Let your agents transact",
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

/** External destinations referenced across the site. */
export const LINKS = {
  github: "https://github.com/tentaclepay",
  x: "https://x.com/tentaclepay",
  docs: "https://docs.tentaclepay.com",
  agentQuickstart: "https://docs.tentaclepay.com/x402/quickstart-for-agents",
  sellerQuickstart: "https://docs.tentaclepay.com/x402/quickstart-for-sellers",
  crossChain: "https://docs.tentaclepay.com/cross-chain/overview",
  walletSetup: "https://docs.tentaclepay.com/wallet/get-started",
} as const;
