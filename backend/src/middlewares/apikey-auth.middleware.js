import crypto from "crypto";
import { UnauthorizedException } from "../utils/app-error.js";
import { KEY_TYPE } from "../utils/key.js";
import { findApiKeyByHash, updateLastUsedAt } from "../models/apiKeys.model.js";
import { findUserById } from "../models/user.model.js";
import { logger } from "../utils/logger.js";

export const apiKeyAuthMiddleware = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader?.startsWith("Bearer ")) {
            throw new UnauthorizedException(
                "API Key Required. Use Authorization: Bearer <API_KEY>",
            );
        }

        const apiKey = authHeader.slice(7).trim();
        if (!apiKey) throw new UnauthorizedException("API Key Missing");

        if (!apiKey.startsWith("sk_") || apiKey.length < 20) {
            logger.error("Invalid Api Key Format");
            throw new UnauthorizedException("Invalid Api Key Format");
        }

        const parts = apiKey.split("_");
        if (parts.length < 3 || parts[0] !== "sk") {
            throw new UnauthorizedException("Invalid Api Key Format");
        }

        const keyType = parts[1];

        if (!Object.values(KEY_TYPE).includes(keyType)) {
            throw new UnauthorizedException("Invalid Api Key Type");
        }

        const hashedKey = crypto
            .createHash("sha256")
            .update(apiKey)
            .digest("hex");

        const apiKeyRecord = await findApiKeyByHash(hashedKey);

        if (!apiKeyRecord) {
            logger.warn("API Key Not Found");
            throw new UnauthorizedException("Invalid API Key");
        }

        const user = await findUserById(apiKeyRecord.userId);

        if (!user) {
            throw new UnauthorizedException("User Not Found For This API Key");
        }

        updateLastUsedAt(hashedKey).catch((err) =>
            logger.error("Failed To Update API Key last_used_at", err),
        );

        req.user = user;

        logger.info("API KEY Used", apiKeyRecord.displayKey);

        next();
    } catch (error) {
        next(error);
    }
};
