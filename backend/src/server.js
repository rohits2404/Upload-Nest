import "dotenv/config";
import "./config/passport-config.js";

import express from "express";
import helmet from "helmet";
import cors from "cors";
import passport from "passport";

import { UnauthorizedException } from "./utils/app-error.js";
import { asyncHandler } from "./middlewares/asyncHander.middleware.js";
import { HTTPSTATUS } from "./config/http.config.js";
import { errorHandler } from "./middlewares/errorHandler.middleware.js";
import { logger } from "./utils/logger.js";

import internalRoutes from "./routes/internal/index.js";
import publicRoutes from "./routes/public/index.js";

const app = express();

console.log("[BASE_PATH]", process.env.BASE_PATH);

const allowedOrigins = (process.env.CLIENT_URL ?? "")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);

const corsOptions = {
    credentials: true,
    origin(origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            return callback(null, true);
        }

        return callback(
            new UnauthorizedException(
                `CORS Error: Origin ${origin} Is Not Allowed`,
            ),
            false,
        );
    },
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(helmet());
app.use(passport.initialize());

app.get(
    "/",
    asyncHandler(async (req, res) => {
        res.status(HTTPSTATUS.OK).json({
            message: "Server Is LIVE",
        });
    }),
);

app.use((req, res, next) => {
    console.log("[REQUEST]", req.method, req.originalUrl);
    next();
});

app.use(process.env.BASE_PATH || "/api/v1", internalRoutes);
app.use(publicRoutes);

app.use(errorHandler);

async function startServer() {
    try {
        if (!process.env.DATABASE_URL) {
            throw new Error("DATABASE_URL Is Not Configured");
        }

        const port = Number(process.env.PORT || 3000);

        const server = app.listen(port, () => {
            logger.info(
                `Server Listening On Port ${port} In ${process.env.NODE_ENV || "development"} Mode`,
            );
        });

        const shutdown = (signal) => {
            logger.warn(`${signal} Received: Shutting Down Gracefully`);

            server.close((error) => {
                if (error) {
                    logger.error("Error Closing HTTP Server", error);
                    process.exitCode = 1;
                    return;
                }

                logger.info("HTTP Server Closed");
                process.exit(0);
            });
        };

        process.once("SIGTERM", () => shutdown("SIGTERM"));
        process.once("SIGINT", () => shutdown("SIGINT"));
    } catch (error) {
        logger.error("Failed To Start Server", error);
        process.exit(1);
    }
}

startServer();
