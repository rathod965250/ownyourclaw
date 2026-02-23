"use server";

import { dodoClient } from "@/lib/dodo-payments/client";

/**
 * A cleaned-up product suitable for the pricing UI.
 */
export interface PricingProduct {
    productId: string;
    name: string;
    description: string | null;
    /** Price in dollars (or equivalent major currency unit) */
    priceAmount: number;
    /** ISO currency code, e.g. "USD" */
    currency: string;
    /** Billing interval: "month", "year", or null for one-time */
    interval: string | null;
    isRecurring: boolean;
    image: string | null;
    metadata: Record<string, string>;
}

/**
 * Fetches all recurring (subscription) products from Dodo Payments
 * and normalises them for the pricing UI.
 *
 * Results are cached for 5 minutes (Next.js data cache + revalidate).
 */
export async function getDodoProducts(): Promise<PricingProduct[]> {
    try {
        const page = await dodoClient.products.list({ recurring: true });
        const items = page.items ?? [];

        const products: PricingProduct[] = items.map((p) => {
            // Price is in lowest denomination (cents for USD)
            const rawPrice = p.price ?? 0;
            const currency = (p.currency ?? "USD").toUpperCase();

            // Derive interval from price_detail if present
            let interval: string | null = null;
            if (
                p.price_detail &&
                "payment_frequency_interval" in p.price_detail
            ) {
                interval = p.price_detail.payment_frequency_interval;
            }

            // Zero-decimal currencies (JPY, KRW, etc.)
            const zeroDecimal = new Set(["JPY", "KRW", "VND", "CLP", "ISK"]);
            const priceAmount = zeroDecimal.has(currency)
                ? rawPrice
                : rawPrice / 100;

            return {
                productId: p.product_id,
                name: p.name ?? "Untitled",
                description: p.description ?? null,
                priceAmount,
                currency,
                interval,
                isRecurring: p.is_recurring,
                image: p.image ?? null,
                metadata: p.metadata ?? {},
            };
        });

        // Sort by price ascending (cheapest first)
        products.sort((a, b) => a.priceAmount - b.priceAmount);

        return products;
    } catch (err) {
        console.error("Failed to fetch Dodo products:", err);
        return [];
    }
}
