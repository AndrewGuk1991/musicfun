import {useGetMeQuery} from "@/features/auth/api/authApi.ts";

export const Home = () => {

    const {data} = useGetMeQuery()

    return (
        <div>
            <h1>Home </h1>
            <div>login: {data?.login} </div>
        </div>
    )
}