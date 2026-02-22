// app/checkout/route.ts
import { DodoPaymentsEnvironment } from "@/lib/dodo-payments/client";
import { Checkout } from "@dodopayments/nextjs";
import { NextRequest, NextResponse } from "next/server";

function detectCountry(req: NextRequest): string | null {
  // Common headers used by Vercel/Cloudflare/proxies
  return (
    req.headers.get("x-vercel-ip-country") ||
    req.headers.get("cf-ipcountry") ||
    req.headers.get("x-geo-country") ||
    null
  );
}

// Static checkout (GET): manipulates query params
export const GET = async (req: NextRequest) => {
  const country = detectCountry(req);
  const url = new URL(req.url);

  // If user is in India, pin INR and hide currency selector
  if (country === "IN") {
    url.searchParams.set("paymentCurrency", "INR");
    url.searchParams.set("showCurrencySelector", "false");
  }

  const origin = url.origin;
  const handler = Checkout({
    bearerToken: process.env.DODO_PAYMENTS_API_KEY!,
    returnUrl: `${origin}/dashboard`,
    environment: process.env.DODO_PAYMENTS_ENVIRONMENT as DodoPaymentsEnvironment,
    type: "static",
  });

  // Forward the modified request to the handler
  const fwdReq = new Request(url.toString(), {
    method: req.method,
    headers: req.headers,
  });
  // @ts-expect-error: adapter accepts Request
  return handler(fwdReq);
};

// Checkout session (POST): injects JSON fields
export const POST = async (req: NextRequest) => {
  const country = detectCountry(req);
  const { origin } = new URL(req.url);

  // Read body once and merge our overrides if IN
  let body: any = {};
  try {
    body = await req.json();
  } catch {
    // If no body provided, continue with defaults
    body = {};
  }

  if (country === "IN") {
    body.billing_currency = "INR"; // ISO code
    body.feature_flags = {
      ...(body.feature_flags || {}),
      allow_currency_selection: false,
    };
  }

  const handler = Checkout({
    bearerToken: process.env.DODO_PAYMENTS_API_KEY!,
    returnUrl: `${origin}/dashboard`,
    environment: process.env.DODO_PAYMENTS_ENVIRONMENT as DodoPaymentsEnvironment,
    type: "session",
  });

  const fwdReq = new Request(req.url, {
    method: "POST",
    headers: req.headers,
    body: JSON.stringify(body),
  });
  // @ts-expect-error: adapter accepts Request
  return handler(fwdReq);
};
