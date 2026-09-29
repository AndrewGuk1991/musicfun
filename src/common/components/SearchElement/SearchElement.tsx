import {type ChangeEvent} from "react";
import s from './SearchElement.module.css'
import {Icon} from "@/common/components";

interface Props {
    value: string;
    onChange: (e: ChangeEvent<HTMLInputElement>) => void;
    isLoading?: boolean;
    placeholder?: string;
}

export const SearchElement = ({value, onChange, isLoading, placeholder = "Search..."}: Props) => {
    return (
        <div className={s.inputContainer}>
            <Icon className={s.searchIcon} id="icon-search"/>
            <input
                className={s.searchInput}
                type="search"
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                disabled={isLoading}
            />
        </div>
    );
};
