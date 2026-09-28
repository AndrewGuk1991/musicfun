
import { type ChangeEvent } from "react";
import { Icon } from "@/common/components";
import s from './PlaylistsSearch.module.css'

interface Props {
    value: string;
    onChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

export const PlaylistsSearch = ({ value, onChange }: Props) => {
    return (
        <div className={s.inputContainer}>
            <Icon className={s.searchIcon} id="icon-search" />
            <input
                className={s.searchInput}
                type="search"
                placeholder="Search playlist"
                value={value} // Лучше сделать инпут контролируемым
                onChange={onChange}
            />
        </div>
    );
};
