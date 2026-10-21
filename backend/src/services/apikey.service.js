import {
    createApiKey,
    findApiKeysByUserId,
    deleteApiKey,
} from "../models/apiKeys.model.js";
import { NotFoundException } from "../utils/app-error.js";
import { generateAPIKey } from "../utils/key.js";

export const createApiKeyService = async (userId, name) => {
    const { rawKey, hashedKey, displayKey } = generateAPIKey();

    await createApiKey({
        userId,
        name,
        hashedKey,
        displayKey,
    });

    return {
        rawKey,
    };
};

export const getAllApiKeysService = async (userId, pagination) => {
    const { pageSize, pageNumber } = pagination;
    const skip = (pageNumber - 1) * pageSize;

    const { apiKeys, totalCount } = await findApiKeysByUserId({
        userId,
        limit: pageSize,
        offset: skip,
    });

    const totalPages = Math.ceil(totalCount / pageSize);

    return {
        apiKeys,
        pageination: {
            pageSize,
            totalCount,
            totalPages,
            pageNumber,
            skip,
        },
    };
};

export const deleteApiKeyService = async (userId, apiKeyId) => {
    const deleted = await deleteApiKey(apiKeyId, userId);

    if (!deleted) {
        throw new NotFoundException("API Key Not Found");
    }

    return {
        deletedCount: 1,
    };
};
