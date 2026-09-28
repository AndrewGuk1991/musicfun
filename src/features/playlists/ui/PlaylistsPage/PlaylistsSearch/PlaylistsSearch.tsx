import {type ChangeEvent} from "react";
import {Icon} from "@/common/components";
import s from './PlaylistsSearch.module.css'

interface Props {
    value: string;
    onChange: (e: ChangeEvent<HTMLInputElement>) => void;
    isLoading?: boolean;
}

export const PlaylistsSearch = ({value, onChange, isLoading}: Props) => {
    return (
        <div className={s.inputContainer}>
            <Icon className={s.searchIcon} id="icon-search"/>
            <input
                className={s.searchInput}
                type="search"
                placeholder="Search playlist"
                value={value}
                onChange={onChange}
                disabled={isLoading}
            />
        </div>
    );
};
