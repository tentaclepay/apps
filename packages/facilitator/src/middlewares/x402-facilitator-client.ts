import { SuiGrpcClient } from "@mysten/sui/grpc";
import { Ed25519Keypair } from "@mysten/sui/keypairs/ed25519";
import { x402Facilitator } from "@x402/core/facilitator";
import { createMiddleware } from "hono/factory";

import { createSuiClientRegistry } from "@tentaclepay/sui-x402";

import type { Env } from "../env";
import { registerSuiExactScheme } from "../lib/x402/scheme";
import { createSuiFacilitatorSigner } from "../lib/x402/signer";

export type X402FacilitatorClientVariables = {
  X402_FACILITATOR: x402Facilitator;
};

export const x402FacilitatorClient = () =>
  createMiddleware<Env>(async (c, next) => {
    const facilitator = new x402Facilitator();
    const keypair = Ed25519Keypair.fromSecretKey(c.env.FACILITATOR_PRIVATE_KEY);
    const signer = createSuiFacilitatorSigner(keypair);

    const clientRegistry = createSuiClientRegistry();

    clientRegistry.set(
      "sui:mainnet",
      new SuiGrpcClient({
        network: "mainnet",
        baseUrl:
          c.env.SUI_MAINNET_GRPC_URL ?? "https://fullnode.mainnet.sui.io:443",
      })
    );

    clientRegistry.set(
      "sui:testnet",
      new SuiGrpcClient({
        network: "testnet",
        baseUrl:
          c.env.SUI_TESTNET_GRPC_URL ?? "https://fullnode.testnet.sui.io:443",
      })
    );

    // clientRegistry.set(
    //   "sui:devnet",
    //   new SuiGrpcClient({
    //     network: "devnet",
    //     baseUrl:
    //       c.env.SUI_DEVNET_GRPC_URL ?? "https://fullnode.devnet.sui.io:443",
    //   })
    // );

    registerSuiExactScheme(facilitator, signer, clientRegistry);

    c.set("X402_FACILITATOR", facilitator);

    return next();
  });
