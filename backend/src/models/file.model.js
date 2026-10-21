import { sql } from "../config/db.js";
import { formatBytes } from "../utils/format-byte.js";

function formatFile(row) {
    if (!row) return null;

    return {
        ...row,
        formattedSize: formatBytes(Number(row.size)),
        size: Number(row.size),
    };
}

function escapeLike(value) {
    return value.replace(/[\\%_]/g, "\\$&");
}

export const UploadSourceEnum = {
    WEB: "WEB",
    API: "API",
};

export async function findFileByIdPublic(id) {
    const rows = await sql`
    SELECT
      id,
      user_id AS "userId",
      storage_key AS "storageKey",
      mime_type AS "mimeType",
      size
    FROM files
    WHERE id = ${id}
    LIMIT 1
  `;

    return formatFile(rows[0]);
}

export async function createFile({
    userId,
    originalName,
    storageKey,
    mimeType,
    size,
    ext,
    url = null,
    uploadVia,
}) {
    const rows = await sql`
    INSERT INTO files (
      user_id,
      original_name,
      storage_key,
      mime_type,
      size,
      ext,
      url,
      upload_via
    )
    VALUES (
      ${userId},
      ${originalName},
      ${storageKey},
      ${mimeType},
      ${size},
      ${ext},
      ${url},
      ${uploadVia}
    )
    RETURNING
      id,
      user_id AS "userId",
      original_name AS "originalName",
      storage_key AS "storageKey",
      mime_type AS "mimeType",
      size,
      ext,
      url,
      upload_via AS "uploadVia",
      created_at AS "createdAt",
      updated_at AS "updatedAt"
  `;

    return formatFile(rows[0]);
}

export async function findFileById(id, userId) {
    const rows = await sql`
    SELECT
      id,
      user_id AS "userId",
      original_name AS "originalName",
      storage_key AS "storageKey",
      mime_type AS "mimeType",
      size,
      ext,
      url,
      upload_via AS "uploadVia",
      created_at AS "createdAt",
      updated_at AS "updatedAt"
    FROM files
    WHERE id = ${id}
      AND user_id = ${userId}
    LIMIT 1
  `;

    return formatFile(rows[0]);
}

export async function findFilesByUserId({ userId, keyword, limit, offset }) {
    const trimmed = keyword?.trim();
    const pattern = trimmed ? `%${escapeLike(trimmed)}%` : null;

    const [rows, countRows] = await Promise.all([
        sql`
      SELECT
        id,
        user_id AS "userId",
        original_name AS "originalName",
        storage_key AS "storageKey",
        mime_type AS "mimeType",
        size,
        ext,
        url,
        upload_via AS "uploadVia",
        created_at AS "createdAt",
        updated_at AS "updatedAt"
      FROM files
      WHERE user_id = ${userId}
        AND (${pattern}::text IS NULL OR original_name ILIKE ${pattern})
      ORDER BY created_at DESC
      LIMIT ${limit}
      OFFSET ${offset}
    `,
        sql`
      SELECT COUNT(*)::int AS count
      FROM files
      WHERE user_id = ${userId}
        AND (${pattern}::text IS NULL OR original_name ILIKE ${pattern})
    `,
    ]);

    return {
        files: rows.map(formatFile),
        totalCount: countRows[0].count,
    };
}

export async function findFilesByIds(ids, userId) {
    const rows = await sql`
    SELECT
      id,
      user_id AS "userId",
      original_name AS "originalName",
      storage_key AS "storageKey",
      mime_type AS "mimeType",
      size,
      ext,
      url,
      upload_via AS "uploadVia",
      created_at AS "createdAt",
      updated_at AS "updatedAt"
    FROM files
    WHERE id = ANY(${ids}::uuid[])
      AND user_id = ${userId}
  `;

    return rows.map(formatFile);
}

export async function calculateUsage(userId) {
    const rows = await sql`
    SELECT COALESCE(SUM(size), 0)::text AS usage
    FROM files
    WHERE user_id = ${userId}
  `;

    return Number(rows[0].usage);
}

export async function deleteFile(id, userId) {
    const rows = await sql`
    DELETE FROM files
    WHERE id = ${id}
      AND user_id = ${userId}
    RETURNING id
  `;

    return rows.length > 0;
}

export async function deleteFilesByIds(ids, userId) {
    if (!ids.length) return 0;

    const rows = await sql`
    DELETE FROM files
    WHERE id = ANY(${ids}::uuid[])
      AND user_id = ${userId}
    RETURNING id
  `;

    return rows.length;
}

export async function getUploadStatsByDate({ userId, dateFrom, dateTo }) {
    const from = dateFrom ? new Date(dateFrom).toISOString() : null;
    const to = dateTo ? new Date(dateTo).toISOString() : null;

    const rows = await sql`
    SELECT
      to_char(created_at AT TIME ZONE 'UTC', 'YYYY-MM-DD') AS date,
      COUNT(*)::int AS "uploadedFiles",
      COALESCE(SUM(size), 0)::text AS usages
    FROM files
    WHERE user_id = ${userId}
      AND (${from}::timestamptz IS NULL OR created_at >= ${from}::timestamptz)
      AND (${to}::timestamptz IS NULL OR created_at <= ${to}::timestamptz)
    GROUP BY 1
    ORDER BY 1
  `;

    return rows.map((row) => ({
        date: row.date,
        uploadedFiles: row.uploadedFiles,
        usages: Number(row.usages),
    }));
}
