import s from './PlaylistsPage.module.css'
import {useDeletePlaylistMutation, useFetchPlaylistsQuery} from "@/features/playlists/api/playlists/playlistsApi.ts";
import {CreatePlaylistForm} from "@/features/playlists/ui";
import {useForm} from "react-hook-form";
import type {PlaylistData, UpdatePlaylistArgs} from "@/features/playlists/api/playlists/playlistsApi.types.ts";
import {useState} from "react";
import {PlaylistItem} from "@/features/playlists/ui/PlaylistsPage/PlaylistItem/PlaylistItem.tsx";
import {EditPlaylistForm} from "@/features/playlists/ui/PlaylistsPage/EditPlaylistForm/EditPlaylistForm.tsx";
import {useDebounceValue} from "@/common/hooks";
import {Pagination} from "@/common/components/Pagination/Pagination.tsx";

export const PlaylistsPage = () => {

    const [editingPlaylistId, setEditingPlaylistId] = useState<string | null>(null)

    const [search, setSearch] = useState('')

    const debounceSearch = useDebounceValue(search)

    const [currentPage, setCurrentPage] = useState(1)
    const [pageSize, setPageSize] = useState(2)

    const {data, isLoading} = useFetchPlaylistsQuery({
        search: debounceSearch,
        pageNumber: currentPage,
        pageSize,

    })

    const {register, handleSubmit, reset} = useForm<UpdatePlaylistArgs>(
        {
            defaultValues: {
                data: {
                    type: 'playlists',
                    attributes: {
                        tagIds: ['']
                    }
                },
            }
        }
    )


    const [deletePlaylist] = useDeletePlaylistMutation()


    const deletePlaylistHandler = (playlistId: string) => {
        if (confirm('Are you sure you want to delete this playlist?')) {
            deletePlaylist(playlistId)
        }
    }

    const editPlaylistHandler = (playlist: PlaylistData | null) => {
        if (playlist) {
            setEditingPlaylistId(playlist.id)
            reset({
                data: {
                    type: 'playlists',
                    attributes: {
                        title: playlist.attributes.title,
                        description: 'описание не приходит с бэка',
                        tagIds: playlist.attributes.tags.map(t => t.id),
                    }
                }
            })
        } else {
            setEditingPlaylistId(null)
        }
    }

    const changePageSizeHandler = (size: number) => {
        setPageSize(size)
        setCurrentPage(1)
    }


    return (
        <div className={s.container}>
            <h1>Playlists page</h1>
            <CreatePlaylistForm/>
            <input
                type="search"
                placeholder={'Search playlist by title'}
                onChange={(e) => {

                    setSearch(e.currentTarget.value)
                }}
            />
            <div className={s.items}>
                {!data?.data.length && !isLoading && <h2>Playlists not found</h2>}
                {data?.data.map((playlist) => {

                    const isEditingPlaylist = editingPlaylistId === playlist.id

                    return <div className={s.item} key={playlist.id}>

                        {
                            isEditingPlaylist ?
                                <EditPlaylistForm
                                    editingPlaylistId={editingPlaylistId}
                                    setEditingPlaylistId={setEditingPlaylistId}
                                    editPlaylist={editPlaylistHandler}
                                    handleSubmit={handleSubmit}
                                    register={register}
                                />
                                :
                                <PlaylistItem
                                    playlist={playlist}
                                    deletePlaylistHandler={deletePlaylistHandler}
                                    editPlaylistHandler={editPlaylistHandler}
                                />

                        }

                    </div>
                })}
            </div>
            <Pagination
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
                pagesCount={data?.meta.pagesCount || 1}
                pageSize={pageSize}
                changePageSize={changePageSizeHandler}
            />
        </div>
    )
}