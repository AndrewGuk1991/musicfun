
import s from './App.module.css'

import {ToastContainer} from "react-toastify";
import {Header} from "@/common/components";
import {Routing} from "@/common/routing";

export const App = () => {

    return (

        <>
            <Header/>
            <div className={s.layout}>
                <Routing/>
            </div>
            <ToastContainer/>
        </>
    )
}

