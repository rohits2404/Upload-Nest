import { ZodError } from "zod";
import { HTTPSTATUS } from "../config/http.config.js";
import { AppError } from "../utils/app-error.js";
import { logger } from "../utils/logger.js";
import { ErrorCodeEnum } from "../enums/error-code.enum.js";

const formatZodError = (res, error) => {
    const errors = error?.issues?.map((err) => ({
        field: err.path.join("."),
        message: err.message,
    }));

    return res.status(HTTPSTATUS.BAD_REQUEST).json({
        message: "Validation Failed",
        errors: errors,
        errorCode: ErrorCodeEnum.VALIDATION_ERROR,
    });
};

export const errorHandler = (error, req, res, next) => {
    logger.error(`Error Occured On PATH: ${req.path}`, {
        body: req.body,
        params: req.params,
        error,
    });

    if (error instanceof SyntaxError && "body" in error) {
        return res.status(HTTPSTATUS.BAD_REQUEST).json({
            message: "Invalid Json Format, Please Check Your Request Body",
        });
    }

    if (error instanceof ZodError) {
        return formatZodError(res, error);
    }

    if (error instanceof AppError) {
        return res.status(error.statusCode).json({
            message: error.message,
            errorCode: error.errorCode,
        });
    }

    return res.status(HTTPSTATUS.INTERNAL_SERVER_ERROR).json({
        message: "Internal Server Error",
        error: error?.message || "Unknown Error",
    });
};
