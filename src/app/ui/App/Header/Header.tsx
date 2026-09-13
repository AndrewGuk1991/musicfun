import {Link} from 'react-router'
import s from './Header.module.css'
import {useGetMeQuery, useLogoutMutation} from "@/features/auth/api/authApi.ts";
import {Login} from "@/features/auth/ui";
import {Path} from "@/common/routing";


export const Header = () => {

    const {data} = useGetMeQuery()
    const [logout] = useLogoutMutation()

    const logoutHandler = () => logout()

    return (
        <header className={s.container}>
            {data ? (
                <div className={s.loginContainer}>
                    <Link to={Path.Profile}>{data.login}</Link>
                    <button onClick={logoutHandler}>logout</button>
                </div>
            ) : (
                <Login />
            )}
        </header>
    )
}