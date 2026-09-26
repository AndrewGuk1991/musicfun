import { useGetMeQuery } from "@/features/auth/api/authApi.ts";
import { Login } from "@/features/auth/ui";
import s from './Header.module.css';
import {UserNavigation} from "@/app/ui/App/Header/UserNavigation/UserNavigation.tsx";

export const Header = () => {
    const { data } = useGetMeQuery();

    return (
        <header className={s.container}>
            {data?.login ? <UserNavigation login={data.login} /> : <Login />}
        </header>
    );
};
