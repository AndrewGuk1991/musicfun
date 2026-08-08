
import type { CurrentUserReaction } from '@/common/enums'
import type {Images, Tag, User} from "@/common/types";


export type PlaylistsResponse = {
    data: PlaylistData[]
    meta: PlaylistMeta
}

export type PlaylistData = {
    id: string
    type: 'playlists'
    attributes: PlaylistAttributes
}

export type PlaylistMeta = {
    page: number
    pageSize: number
    totalCount: number
    pagesCount: number
}

export type PlaylistAttributes = {
    title: string
    addedAt: string
    updatedAt: string
    order: number
    user: User
    images: Images
    tags: Tag[]
    currentUserReaction: CurrentUserReaction
    likesCount: number
    dislikesCount: number
    tracksCount: number
    duration: number
}

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
    data: {
        type: 'playlists',
        attributes: {
            title: string,
            description: string
        },
    }
}