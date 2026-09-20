
import type { UpdatePlaylistArgs } from "@/features/playlists/api/playlists/playlistsApi.types.ts";

export type EditFormValues = UpdatePlaylistArgs & {
    data: {
        attributes: {
            coverUrl?: string;
            coverFile?: FileList;
        };
    };
};
