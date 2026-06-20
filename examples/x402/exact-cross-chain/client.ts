import { getNetworkConfig, IkaClient } from "@ika.xyz/sdk";
import { SuiGrpcClient } from "@mysten/sui/grpc";
import { Ed25519Keypair } from "@mysten/sui/keypairs/ed25519";
import { x402Client, x402HTTPClient } from "@x402/core/client";
import { ExactEvmScheme } from "@x402/evm";
import { wrapFetchWithPayment } from "@x402/fetch";
import { configDotenv } from "dotenv";

import { createCrossChainEvmSigner } from "@tentaclepay/sdk/x402/evm";

configDotenv({ quiet: true });

if (!process.env.CLIENT_PRIVATE_KEY)
  throw new Error("CLIENT_PRIVATE_KEY is required!");
if (!process.env.VERIFIER_URL) throw new Error("VERIFIER_URL is required!");

const verifierUrl = process.env.VERIFIER_URL;

// Create signer
const keypair = Ed25519Keypair.fromSecretKey(process.env.CLIENT_PRIVATE_KEY);

const suiClient = new SuiGrpcClient({
  network: "testnet",
  baseUrl: "https://fullnode.testnet.sui.io:443",
});

const ikaClient = new IkaClient({
  suiClient,
  config: getNetworkConfig("testnet"),
});

await ikaClient.initialize();

const crossChainEvmSigner = await createCrossChainEvmSigner(
  keypair,
  verifierUrl,
  suiClient,
  ikaClient
);

// Create x402 client and register EVM scheme
const client = new x402Client();
client.register("eip155:84532", new ExactEvmScheme(crossChainEvmSigner));

// Wrap fetch with payment handling
const fetchWithPayment = wrapFetchWithPayment(fetch, client);

// Make request - payment is handled automatically
const response = await fetchWithPayment("http://localhost:3000/weather", {
  method: "GET",
  headers: {
    "Content-Type": "application/json",
  },
});

const data = await response.json();
console.log("Response:", data);

// Get payment receipt from response headers
if (response.ok) {
  const httpClient = new x402HTTPClient(client);
  const paymentResponse = httpClient.getPaymentSettleResponse((name) =>
    response.headers.get(name)
  );
  console.log(
    "Transaction:",
    `http://sepolia.basescan.org/tx/${paymentResponse.transaction}`
  );
}
