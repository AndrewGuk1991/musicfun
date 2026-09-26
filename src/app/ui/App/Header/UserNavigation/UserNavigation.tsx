import { useState } from "react";
import { Icon } from "@/common/components";
import s from './UserNavigation.module.css';
import {DropdownMenu} from "@/app/ui/App/Header/UserNavigation/DropdownMenu/DropdownMenu.tsx";
import {useClickOutside} from "@/common/hooks";

type UserNavigationProps = {
    login: string;
};

export const UserNavigation = ({ login }: UserNavigationProps) => {
    const [isOpen, setIsOpen] = useState(false);

    const closeDropdown = () => setIsOpen(false);
    const toggleDropdown = () => setIsOpen(prev => !prev);

    const dropdownRef = useClickOutside(closeDropdown);
    const firstLetter = login ? login.charAt(0).toUpperCase() : '';

    return (
        <div className={s.loginContainer} ref={dropdownRef}>
            <div className={s.avatarPlaceholder}>{firstLetter}</div>

            <div className={s.dropdownWrapper}>
                <button className={s.dropdownButton} onClick={toggleDropdown} type="button">
                    <span>{login}</span>
                    <Icon
                        id="icon-arrow-down"
                        width={14}
                        height={7}
                        viewBox="0 0 14 7"
                        className={`${s.arrow} ${isOpen ? s.rotated : ''}`}
                    />
                </button>

                {isOpen && <DropdownMenu onClose={closeDropdown} />}
            </div>
        </div>
    );
};
