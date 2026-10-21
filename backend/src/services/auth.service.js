import {
    createUserWithStorage,
    findUserByEmail,
    verifyPassword,
} from "../models/user.model.js";
import {
    NotFoundException,
    UnauthorizedException,
} from "../utils/app-error.js";
import { logger } from "../utils/logger.js";
import { signJwtToken } from "../utils/jwt.js";

export const registerService = async (body) => {
    const { email } = body;

    const existingUser = await findUserByEmail(email);
    if (existingUser) throw new UnauthorizedException("User Already Exists");

    try {
        const user = await createUserWithStorage({
            name: body.name,
            email,
            password: body.password,
            profilePicture: body.profilePicture || null,
        });

        return { user };
    } catch (error) {
        if (error?.code === "23505") {
            throw new UnauthorizedException("User Already Exists");
        }
        logger.error("Error Registering User", error);
        throw error;
    }
};

export const loginService = async (body) => {
    const { email, password } = body;

    const user = await findUserByEmail(email);
    if (!user) throw new NotFoundException("Email/Password Not Found");

    const isPasswordValid = await verifyPassword(user, password);
    if (!isPasswordValid)
        throw new UnauthorizedException("Email/Password Is Incorrect");

    const { token, expiresAt } = signJwtToken({
        userId: user.id,
    });

    const { password: _password, ...safeUser } = user;

    return {
        user: safeUser,
        accessToken: token,
        expiresAt,
    };
};
