import {useFetchTracksQuery} from "@/features/tracks/api/tracksApi.ts";


export const  TracksPage = () => {

    const {data} = useFetchTracksQuery()
    console.log(data)

    return (
        <>
            <h2>TracksPage</h2>
        </>
    )
}