import {Route, Routes} from "react-router"
import {TracksPage} from "@/features/tracks/ui";
import {PageNotFound} from "@/common/components";
import {PlaylistsPage} from "@/features/playlists/ui";
import {OAuthCallback, ProfilePage} from "@/features/auth/ui";
import {Home} from "@/app/ui";


export const Path = {
    Home: '/',
    YourLibrary: '/yourLibrary',
    CreatePlaylistForm: '/createPlaylistForm',
    UploadTrack: '/uploadTrack',
    Playlists: '/playlists',
    Tracks: '/tracks',
    Profile: '/profile',
    OAuthRedirect: '/oauth/callback',
    NotFound: '*',
} as const


export const Routing = () => (
    <Routes>
        <Route path={Path.Home} element={<Home/>} />
        <Route path={Path.Playlists} element={<PlaylistsPage />} />
        <Route path={Path.Tracks} element={<TracksPage />} />
        <Route path={Path.Profile} element={<ProfilePage />} />
        <Route path={Path.OAuthRedirect} element={<OAuthCallback />} />
        <Route path={Path.NotFound} element={<PageNotFound />} />
    </Routes>
)