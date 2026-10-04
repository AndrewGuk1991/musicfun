import type {RefObject} from "react";
import s from "./LoadingTrigger.module.css";

type Props = {
    observerRef: RefObject<HTMLDivElement | null>
    isFetchingNextPage: boolean
}


export const LoadingTrigger = ({observerRef, isFetchingNextPage}: Props) => {
    return (
        <div ref={observerRef} className={s.triggerContainer}>
            {isFetchingNextPage ? (
                <div className={s.spinner} />
            ) : (
                <div className={s.emptySpace} />
            )}
        </div>
    )
}