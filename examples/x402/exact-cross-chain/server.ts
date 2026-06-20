import { serve } from "@hono/node-server";
import { HTTPFacilitatorClient } from "@x402/core/server";
import { ExactEvmScheme } from "@x402/evm/exact/server";
import { paymentMiddleware, x402ResourceServer } from "@x402/hono";
import { createPaywall } from "@x402/paywall";
import { evmPaywall } from "@x402/paywall/evm";
import { configDotenv } from "dotenv";
import { Hono } from "hono";
import { logger } from "hono/logger";

configDotenv({ quiet: true });

const evmAddress = process.env.SERVER_RECIPIENT_ADDRESS;
if (!evmAddress) throw new Error("SERVER_RECIPIENT_ADDRESS is required!");

const facilitatorUrl =
  process.env.FACILITATOR_URL || "https://www.x402.org/facilitator";

const facilitatorClient = new HTTPFacilitatorClient({
  url: facilitatorUrl,
});

const paywall = createPaywall()
  .withNetwork(evmPaywall)
  .withConfig({
    appName: "My App",
    testnet: true,
  })
  .build();

const app = new Hono();
app.use(logger());
app.use(
  paymentMiddleware(
    {
      "GET /weather": {
        accepts: [
          {
            scheme: "exact",
            price: "$0.05",
            network: "eip155:84532",
            payTo: evmAddress,
          },
        ],
        description: "Weather data",
        mimeType: "application/json",
      },
    },
    new x402ResourceServer(facilitatorClient).register(
      "eip155:84532",
      new ExactEvmScheme()
    ),
    undefined,
    paywall
  )
);

app.get("/weather", (c) => {
  return c.json({
    report: {
      weather: "sunny",
      temperature: 70,
    },
  });
});

serve(app, (info) => {
  console.info(`Server running on port ${info.port}`);
});
