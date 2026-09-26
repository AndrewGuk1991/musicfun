import { useNavigate } from 'react-router';

import s from './DropdownMenu.module.css';
import {Icon} from "@/common/components";
import {useLogoutMutation} from "@/features/auth/api/authApi.ts";
import {Path} from "@/common/routing";

type DropdownMenuProps = {
    onClose: () => void;
};

export const DropdownMenu = ({ onClose }: DropdownMenuProps) => {
    const [logout] = useLogoutMutation();
    const navigate = useNavigate();

    const handleProfileClick = () => {
        navigate(Path.Profile);
        onClose();
    };

    const handleLogoutClick = () => {
        logout();
        onClose();
    };

    return (
        <ul className={s.dropdownMenu}>
            <li onClick={handleProfileClick}>
                <Icon id="icon-my-profile" width={18} height={21} viewBox="0 0 18 21" />
                <span>My Profile</span>
            </li>
            <li onClick={handleLogoutClick}>
                <Icon id="icon-logout" width={18} height={18} viewBox="0 0 18 18" />
                <span>Logout</span>
            </li>
        </ul>
    );
};
