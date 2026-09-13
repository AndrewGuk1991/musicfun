import s from './App.module.css'
import {ToastContainer} from "react-toastify";
import {LinearProgress} from "@/common/components";
import {Routing} from "@/common/routing";
import {useGlobalLoading} from "@/common/hooks";
import {Header, Sidebar} from "@/app/ui";


export const App = () => {

    const isGlobalLoading = useGlobalLoading()

    return (

        <>
            <Header/>
            {isGlobalLoading && <LinearProgress/>}
            <div className={s.layout}>
                <Sidebar />
                <main className={s.content}>
                    <Routing />
                </main>
            </div>
            <ToastContainer/>
        </>
    )
}

