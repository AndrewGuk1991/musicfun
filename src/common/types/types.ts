import {
    type coverSchema,
    currentUserReactionSchema,
    type imagesSchema, reactionUserResponseSchema,
    type tagSchema,
    type userSchema
} from "@/common/schemas"

import * as z from "zod"

export type Tag = z.infer<typeof tagSchema>
export type User = z.infer<typeof userSchema>
export type Cover = z.infer<typeof coverSchema>
export type Images = z.infer<typeof imagesSchema>
export type CurrentUserReactionValue = z.infer<typeof currentUserReactionSchema>;
export type ReactionUserResponse = z.infer<typeof reactionUserResponseSchema>