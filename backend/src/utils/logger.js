import winston from "winston";

const { combine, colorize, timestamp, errors, json, printf } = winston.format;

const isProduction = process.env.NODE_ENV === "production";

const consoleFormat = combine(
    colorize({
        all: true,
        colors: {
            info: "blue",
            warn: "yellow",
            error: "red",
            debug: "cyan",
            verbose: "grey",
            http: "green",
        },
    }),
    timestamp({ format: "YYYY-MM-DD hh:mm:ss A" }),
    errors({ stack: true }),
    printf(({ level, message, stack, timestamp, ...meta }) => {
        const metadata = Object.keys(meta).length
            ? ` ${JSON.stringify(meta)}`
            : "";

        return `${timestamp} [${level.toUpperCase()}]: ${
            stack || message
        }${stack && message !== stack ? "" : ""}${metadata}`;
    }),
);

const productionFormat = combine(timestamp(), errors({ stack: true }), json());

export const logger = winston.createLogger({
    level: process.env.LOG_LEVEL || "info",
    format: isProduction ? productionFormat : consoleFormat,
    transports: [new winston.transports.Console()],
    silent: process.env.NODE_ENV === "test",
});
