/**
 * AES-256-GCM encryption / decryption for OAuth tokens.
 *
 * ENCRYPTION_KEY must be exactly 32 hex bytes (64 chars) in .env.local
 * Generate: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
 */

import { createCipheriv, createDecipheriv, randomBytes } from "crypto";

const ALGO = "aes-256-gcm";

function getKey(): Buffer {
    const raw = process.env.ENCRYPTION_KEY;
    if (!raw || raw.length < 32) {
        throw new Error(
            "ENCRYPTION_KEY env var must be set (at least 32 chars). " +
            'Generate with: node -e "console.log(require(\'crypto\').randomBytes(32).toString(\'hex\'))"'
        );
    }
    // If key is hex-encoded (64 chars), decode. Otherwise use raw UTF-8.
    if (/^[0-9a-f]{64}$/i.test(raw)) {
        return Buffer.from(raw, "hex");
    }
    return Buffer.from(raw.slice(0, 32), "utf8");
}

/**
 * Encrypt a plaintext string → base64 ciphertext
 * Format: iv(12B) + authTag(16B) + ciphertext
 */
export function encrypt(plaintext: string): string {
    const key = getKey();
    const iv = randomBytes(12);
    const cipher = createCipheriv(ALGO, key, iv);

    const encrypted = Buffer.concat([
        cipher.update(plaintext, "utf8"),
        cipher.final(),
    ]);
    const tag = cipher.getAuthTag();

    // iv + tag + ciphertext → single base64 blob
    return Buffer.concat([iv, tag, encrypted]).toString("base64");
}

/**
 * Decrypt a base64 ciphertext → plaintext string
 */
export function decrypt(encoded: string): string {
    const key = getKey();
    const buf = Buffer.from(encoded, "base64");

    const iv = buf.subarray(0, 12);
    const tag = buf.subarray(12, 28);
    const data = buf.subarray(28);

    const decipher = createDecipheriv(ALGO, key, iv);
    decipher.setAuthTag(tag);

    return Buffer.concat([
        decipher.update(data),
        decipher.final(),
    ]).toString("utf8");
}
