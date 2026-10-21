import { asyncHandler } from "../middlewares/asyncHander.middleware.js";
import { loginSchema, registerSchema } from "../validators/auth.validator.js";
import { HTTPSTATUS } from "../config/http.config.js";
import { loginService, registerService } from "../services/auth.service.js";

export const registerController = asyncHandler(async (req, res) => {
    const body = registerSchema.parse(req.body);

    await registerService(body);

    return res.status(HTTPSTATUS.CREATED).json({
        message: "User Created Successfully",
    });
});

export const loginController = asyncHandler(async (req, res) => {
    const body = loginSchema.parse(req.body);

    const result = await loginService(body);

    return res.status(HTTPSTATUS.CREATED).json({
        message: "User Logged In Successfully",
        ...result,
    });
});
