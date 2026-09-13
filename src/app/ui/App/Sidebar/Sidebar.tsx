import { NavLink } from 'react-router'
import s from './Sidebar.module.css'
import { Path } from "@/common/routing"
import { Icon } from "@/common/components"

type NavItem = {
    to: string
    label: string
    iconId: string
}

export const Sidebar = () => {
    const group1: NavItem[] = [
        { to: Path.Home, label: 'Home', iconId: 'icon-home' },
        { to: Path.YourLibrary, label: 'Your Library', iconId: 'icon-library' },
    ]

    const group2: NavItem[] = [
        { to: Path.CreatePlaylistForm, label: 'Create Playlist', iconId: 'icon-add-circle' },
        { to: Path.UploadTrack, label: 'Upload Track', iconId: 'icon-upload-track' },
    ]

    const group3: NavItem[] = [
        { to: Path.Tracks, label: 'All Tracks', iconId: 'icon-music-note' },
        { to: Path.Playlists, label: 'All Playlist', iconId: 'icon-audio-player' },
    ]

    const renderLinks = (items: NavItem[]) =>
        items.map(item => (
            <li key={item.to}>
                <NavLink
                    to={item.to}
                    className={({ isActive }) => {
                        // Соединяем глобальную базу для десктопа и локальные стили адаптива
                        const baseClasses = `app-nav-link ${s.mobileLink}`;
                        const activeClasses = isActive ? `app-nav-link-active ${s.mobileActiveLink}` : '';

                        return `${baseClasses} ${activeClasses}`.trim();
                    }}
                >
                    <Icon id={item.iconId} />
                    <span className={s.label}>{item.label}</span>
                </NavLink>
            </li>
        ))

    return (
        <aside className={s.sidebar}>
            <nav>
                <ul className={s.list}>
                    {renderLinks(group1)}
                </ul>

                <hr className={s.separator} />

                <ul className={s.list}>
                    {renderLinks(group2)}
                </ul>

                <hr className={s.separator} />

                <ul className={s.list}>
                    {renderLinks(group3)}
                </ul>
            </nav>
        </aside>
    )
}
