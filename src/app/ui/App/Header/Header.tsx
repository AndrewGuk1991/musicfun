import {useNavigate} from 'react-router'
import s from './Header.module.css'
import {useGetMeQuery, useLogoutMutation} from "@/features/auth/api/authApi.ts";
import {Login} from "@/features/auth/ui";
import {Path} from "@/common/routing";
import {useEffect, useRef, useState} from "react";
import {Icon} from "@/common/components";

export const Header = () => {

    const {data} = useGetMeQuery()
    const [logout] = useLogoutMutation()
    const navigate = useNavigate()

    const [isOpen, setIsOpen] = useState(false)
    const dropdownRef = useRef<HTMLDivElement>(null)

    const firstLetter = data?.login ? data.login.charAt(0).toUpperCase() : '';

    const toggleDropdown = () => setIsOpen(prev => !prev)

    const handleProfileClick = () => {
        navigate(Path.Profile)
        setIsOpen(false)
    }

    const handleLogoutClick = () => {
        logout()
        setIsOpen(false)
    }

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false)
            }
        }
        document.addEventListener("mousedown", handleClickOutside)
        return () => document.removeEventListener("mousedown", handleClickOutside)
    }, [])

    return (
        <header className={s.container}>
            {data ? (
                <div className={s.loginContainer} ref={dropdownRef}>
                    <div className={s.avatarPlaceholder}>
                        {firstLetter}
                    </div>

                    <div className={s.dropdownWrapper}>
                        <button className={s.dropdownButton} onClick={toggleDropdown} type="button">
                            <span>{data.login}</span>

                            <Icon
                                id="icon-arrow-down"
                                width={14}
                                height={7}
                                viewBox="0 0 14 7"
                                className={`${s.arrow} ${isOpen ? s.rotated : ''}`}
                            />
                        </button>

                        {isOpen && (
                            <ul className={s.dropdownMenu}>
                                <li onClick={handleProfileClick}>My Profile</li>
                                <li onClick={handleLogoutClick} className={s.logoutOption}>Logout</li>
                            </ul>
                        )}
                    </div>
                </div>
            ) : (
                <Login />
            )}
        </header>
    )
}

