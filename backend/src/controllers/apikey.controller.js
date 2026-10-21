import { asyncHandler } from "../middlewares/asyncHander.middleware.js";
import { HTTPSTATUS } from "../config/http.config.js";
import { UnauthorizedException } from "../utils/app-error.js";
import {
    createApiKeySchema,
    deleteApiKeySchema,
} from "../validators/apikey.validator.js";
import {
    createApiKeyService,
    deleteApiKeyService,
    getAllApiKeysService,
} from "../services/apikey.service.js";

export const createApiKeyController = asyncHandler(async (req, res) => {
    const userId = req.user?.id;
    if (!userId) throw new UnauthorizedException("User Not Authenticated");

    const { name } = createApiKeySchema.parse(req.body);

    const { rawKey } = await createApiKeyService(userId, name);

    return res.status(HTTPSTATUS.OK).json({
        message: "API Key Created Successfully",
        key: rawKey,
    });
});

export const getAllApiKeysController = asyncHandler(async (req, res) => {
    const userId = req.user?.id;
    if (!userId) throw new UnauthorizedException("User Not Authenticated");

    const pagination = {
        pageSize: parseInt(req.query.pageSize) || 10,
        pageNumber: parseInt(req.query.pageNumber) || 1,
    };

    const result = await getAllApiKeysService(userId, pagination);

    return res.status(HTTPSTATUS.OK).json({
        message: "API Keys Retrieved Successfully",
        ...result,
    });
});

export const deleteApiKeyController = asyncHandler(async (req, res) => {
    const userId = req.user?.id;
    if (!userId) throw new UnauthorizedException("User Not Authenticated");

    const { id } = deleteApiKeySchema.parse(req.params);

    const result = await deleteApiKeyService(userId, id);

    return res.status(HTTPSTATUS.OK).json({
        message: "API Key Deleted Successfully",
        data: result,
    });
});
