import * as z from "zod";
import {currentUserReactionSchema, imagesSchema, userSchema} from "@/common/schemas";

export const trackAttachmentSchema = z.object({
    id: z.string(),
    addedAt: z.string(),
    updatedAt: z.string(),
    version: z.number().nonnegative(),
    url: z.string(), // Оставляем чистую строку, так как Zod ругался на спецсимволы в URL
    contentType: z.string(),
    originalName: z.string(),
    fileSize: z.number().nonnegative(),
});

export const trackAttributesSchema = z.object({
    title: z.string(),
    addedAt: z.string(), // Ослабляем до обычной строки
    likesCount: z.number().int().nonnegative().optional(),
    attachments: z.array(trackAttachmentSchema),
    images: imagesSchema,
    user: userSchema.optional(),
    currentUserReaction: currentUserReactionSchema,
    isPublished: z.boolean().optional(),
    publishedAt: z.string().nullable(),
    duration: z.number().nonnegative(),
    order: z.number().int().nonnegative().optional()
})


export const trackRelationshipsSchema = z.object({
    artists: z.object({
        data: z.array(
            z.object({
                id: z.string(),
                type: z.string(),
            })
        )
    })
})

export const tracksMetaSchema = z.object({
    nextCursor: z.string().nullable().optional(),
    page: z.number().positive().optional(),
    pageSize: z.number().positive().optional(),
    totalCount: z.number().nonnegative().nullable(),
    pagesCount: z.number().positive().optional().nullable(),
})

export const tracksIncludedSchema = z.object({
    id: z.string(),
    type: z.literal('artists'),
    attributes: z.object({
        name: z.string(),
    })
})

export const trackDataSchema = z.object({
    id: z.string(),
    type: z.literal('tracks'),
    attributes: trackAttributesSchema,
    relationships: trackRelationshipsSchema,
})

export const fetchTracksResponseSchema = z.object({
    data: z.array(trackDataSchema),
    included: z.array(z.any()).optional(),
    meta: tracksMetaSchema
})

export const fetchPlaylistTracksResponseSchema = z.object({
    data: z.array(trackDataSchema),
    included: z.array(z.any()).optional(),
    meta: z.object({
        totalCount: z.number().nonnegative()
    })
});
