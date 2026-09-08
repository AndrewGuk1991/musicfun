import * as z from "zod";
import {
    createPlaylistSchema,
    playlistAttributesSchema,
    playlistDataSchema,
    type playlistMetaSchema, playlistsResponseSchema
} from "@/features/playlists/model/playlists.schemas.ts";

export type PlaylistsResponse = z.infer<typeof playlistsResponseSchema>

export type PlaylistData = z.infer<typeof playlistDataSchema>

export type PlaylistMeta = z.infer<typeof playlistMetaSchema>

export type PlaylistAttributes = z.infer<typeof playlistAttributesSchema>

// Arguments
export type FetchPlaylistsArgs = {
    pageNumber?: number
    pageSize?: number
    search?: string
    sortBy?: 'addedAt' | 'likesCount'
    sortDirection?: 'asc' | 'desc'
    tagsIds?: string[]
    userId?: string
    trackId?: string
    onlyLikedByMe?: boolean
}

export type CreatePlaylistArgs = {
    data: z.infer<typeof createPlaylistSchema>
}

export type UpdatePlaylistArgs = {
    data: {
        type: 'playlists',
        attributes: {
            title: string,
            description: string,
            "tagIds": string[]
        }
    }
}