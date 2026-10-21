import { z } from "zod";

// PostgreSQL UUID validation
export const fileIdSchema = z.string().trim().uuid("Invalid File ID");

const baseSchema = z.object({
    fileIds: z
        .array(fileIdSchema)
        .min(1, "At Least One File ID Must Be Provided")
        .refine(
            (ids) => new Set(ids).size === ids.length,
            "Duplicate File IDs Are Not Allowed",
        ),
});

export const deleteFilesSchema = baseSchema;
export const downloadFilesSchema = baseSchema;
