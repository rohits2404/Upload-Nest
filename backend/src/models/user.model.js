import { sql } from "../config/db.js";
import { hashValue, compareValue } from "../utils/bcrypt.js";

export async function createUser({
    name,
    email,
    password = null,
    profilePicture = null,
}) {
    const hashedPassword = password ? await hashValue(password) : null;

    const rows = await sql`
    INSERT INTO users (
      name,
      email,
      password,
      profile_picture
    )
    VALUES (
      ${name.trim()},
      ${email.trim().toLowerCase()},
      ${hashedPassword},
      ${profilePicture}
    )
    RETURNING
      id,
      name,
      email,
      profile_picture AS "profilePicture",
      created_at AS "createdAt",
      updated_at AS "updatedAt"
  `;

    return rows[0];
}

export async function createUserWithStorage({
    name,
    email,
    password = null,
    profilePicture = null,
}) {
    const hashedPassword = password ? await hashValue(password) : null;

    const rows = await sql`
    WITH new_user AS (
      INSERT INTO users (
        name,
        email,
        password,
        profile_picture
      )
      VALUES (
        ${name.trim()},
        ${email.trim().toLowerCase()},
        ${hashedPassword},
        ${profilePicture}
      )
      RETURNING
        id,
        name,
        email,
        profile_picture,
        created_at,
        updated_at
    ),
    new_storage AS (
      INSERT INTO storage (user_id)
      SELECT id FROM new_user
    )
    SELECT
      id,
      name,
      email,
      profile_picture AS "profilePicture",
      created_at AS "createdAt",
      updated_at AS "updatedAt"
    FROM new_user
  `;

    return rows[0];
}

export async function findUserById(id) {
    const rows = await sql`
    SELECT
      id,
      name,
      email,
      profile_picture AS "profilePicture",
      created_at AS "createdAt",
      updated_at AS "updatedAt"
    FROM users
    WHERE id = ${id}
    LIMIT 1
  `;

    return rows[0] ?? null;
}

export async function findUserByEmail(email) {
    const rows = await sql`
    SELECT
      id,
      name,
      email,
      password,
      profile_picture AS "profilePicture",
      created_at AS "createdAt",
      updated_at AS "updatedAt"
    FROM users
    WHERE email = ${email.trim().toLowerCase()}
    LIMIT 1
  `;

    return rows[0] ?? null;
}

export async function verifyPassword(user, password) {
    if (!user?.password) return false;

    return compareValue(password, user.password);
}
