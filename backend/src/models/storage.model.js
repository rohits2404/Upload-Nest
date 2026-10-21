import { sql } from "../config/db.js";
import { formatBytes } from "../utils/format-byte.js";

export const STORAGE_QUOTA = 2 * 1024 * 1024 * 1024;

export async function createStorage(userId) {
    const rows = await sql`
    INSERT INTO storage (user_id)
    VALUES (${userId})
    ON CONFLICT (user_id) DO NOTHING
    RETURNING
      user_id AS "userId",
      storage_quota AS "storageQuota"
  `;

    return rows[0] ?? null;
}

export async function getStorageMetrics(userId) {
    const rows = await sql`
    SELECT
      s.storage_quota::text AS quota,
      COALESCE(SUM(f.size), 0)::text AS usage
    FROM storage s
    LEFT JOIN files f ON f.user_id = s.user_id
    WHERE s.user_id = ${userId}
    GROUP BY s.storage_quota
  `;

    if (!rows.length) {
        const error = new Error("Storage Record Not Found");
        error.statusCode = 404;
        throw error;
    }

    const quota = Number(rows[0].quota);
    const usage = Number(rows[0].usage);

    return {
        quota,
        usage,
        remaining: quota - usage,
        formattedQuota: formatBytes(quota),
        formattedUsage: formatBytes(usage),
        formattedRemaining: formatBytes(quota - usage),
    };
}

export async function validateUpload(userId, fileSize) {
    if (!Number.isSafeInteger(fileSize) || fileSize <= 0) {
        const error = new Error("File Size Must Be a Positive Integer");
        error.statusCode = 400;
        throw error;
    }

    const metrics = await getStorageMetrics(userId);

    if (metrics.remaining < fileSize) {
        const shortfall = fileSize - metrics.remaining;
        const error = new Error(
            `Insufficient Storage. ${formatBytes(shortfall)} Needed.`,
        );

        error.statusCode = 400;
        error.code = "INSUFFICIENT_STORAGE";
        throw error;
    }

    return {
        allowed: true,
        newUsage: metrics.usage + fileSize,
        remainingAfterUpload: metrics.remaining - fileSize,
    };
}
