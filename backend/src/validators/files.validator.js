import { z } from "zod";

export const fileIdSchema = z.string().trim().min(1);

const baseSchema = z.object({
    fileIds: z
        .array(z.string().length(24, "Invaild File ID "))
        .min(1, "At Least One File ID Must Be Provided"),
});

export const deleteFilesSchema = baseSchema;
export const downloadFilesSchema = baseSchema;
