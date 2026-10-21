import { sql } from "../config/db.js";

export async function createApiKey({ userId, name, displayKey, hashedKey }) {
    const rows = await sql`
    INSERT INTO api_keys (
      user_id,
      name,
      display_key,
      hashed_key
    )
    VALUES (
      ${userId},
      ${name},
      ${displayKey},
      ${hashedKey}
    )
    RETURNING
      id,
      user_id AS "userId",
      name,
      display_key AS "displayKey",
      last_used_at AS "lastUsedAt",
      created_at AS "createdAt",
      updated_at AS "updatedAt"
  `;

    return rows[0];
}

export async function findApiKeysByUserId({ userId, limit, offset }) {
    const [rows, countRows] = await Promise.all([
        sql`
      SELECT
        id,
        user_id AS "userId",
        name,
        display_key AS "displayKey",
        last_used_at AS "lastUsedAt",
        created_at AS "createdAt",
        updated_at AS "updatedAt"
      FROM api_keys
      WHERE user_id = ${userId}
      ORDER BY created_at DESC
      LIMIT ${limit}
      OFFSET ${offset}
    `,
        sql`
      SELECT COUNT(*)::int AS count
      FROM api_keys
      WHERE user_id = ${userId}
    `,
    ]);

    return {
        apiKeys: rows,
        totalCount: countRows[0].count,
    };
}

export async function findApiKeyByHash(hashedKey) {
    const rows = await sql`
    SELECT
      id,
      user_id AS "userId",
      name,
      display_key AS "displayKey",
      hashed_key AS "hashedKey",
      last_used_at AS "lastUsedAt"
    FROM api_keys
    WHERE hashed_key = ${hashedKey}
    LIMIT 1
  `;

    return rows[0] ?? null;
}

export async function updateLastUsedAt(hashedKey) {
    await sql`
    UPDATE api_keys
    SET
      last_used_at = NOW(),
      updated_at = NOW()
    WHERE hashed_key = ${hashedKey}
  `;
}

export async function deleteApiKey(id, userId) {
    const rows = await sql`
    DELETE FROM api_keys
    WHERE id = ${id}
      AND user_id = ${userId}
    RETURNING id
  `;

    return rows.length > 0;
}
