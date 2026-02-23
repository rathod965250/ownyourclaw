import type { MetadataRoute } from "next";

const SITE_URL = "https://ownyourclaw.com";

export default function robots(): MetadataRoute.Robots {
    return {
        rules: [
            // Allow all crawlers including AI (GPTBot, PerplexityBot, ClaudeBot, etc.)
            {
                userAgent: "*",
                allow: "/",
                disallow: ["/dashboard", "/api/"],
            },
            // Explicitly allow OpenAI's crawler
            {
                userAgent: "GPTBot",
                allow: "/",
            },
            // Explicitly allow Anthropic's crawler
            {
                userAgent: "anthropic-ai",
                allow: "/",
            },
            // Explicitly allow Perplexity
            {
                userAgent: "PerplexityBot",
                allow: "/",
            },
            // Explicitly allow Google-Extended (for AI Overviews / SGE)
            {
                userAgent: "Google-Extended",
                allow: "/",
            },
        ],
        sitemap: `${SITE_URL}/sitemap.xml`,
        host: SITE_URL,
    };
}
