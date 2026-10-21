import { findUserById } from "../models/user.model.js";

export const findByIdUserService = async (userId) => {
    const user = await findUserById(userId);
    return user ?? undefined;
};
