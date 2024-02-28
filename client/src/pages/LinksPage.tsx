import { useEffect, useState } from "react"
import { redirect, useParams } from "react-router-dom"
import { Page } from "../../../server/src/controllers/page"
import { getLinksPublic, getPagePublic } from "../api/api"
import { Link } from "../../../server/src/controllers/links"

export default function LinksPage() {
    const [page, setPage] = useState<Page>()
    const [links, setLinks] = useState<Link[]>()
    const { username } = useParams()
    if (!username) {
        console.log("Username not set")
        redirect("/")
        return
    }
    console.log(username)
    useEffect(() => {
        getPagePublic(username).then((page) => {
            setPage(page)
        })
        getLinksPublic(username).then((links) => {
            setLinks(links)
        })
    }, [username])
    const linkItems = links?.map((link) => (
        <li
            className="cursor-pointer text-center text-xl m-4 border-2 border-black w-96 p-2 rounded-lg bg-gray-100 hover:bg-gray-300 transition-colors duration-300"
            key={link.id}
        ><a href={link.url}>{link.name}</a></li>
    ))
    return (
        !page
            ? <div>Loading...</div>
            : <div
                style={{ background: `linear-gradient(rgba(0, 0, 0, .2), ${page.background_color})` }}
                className="flex flex-col items-center h-screen ">
                <h1 className="text-3xl m-8">{page?.bio}</h1>
                <ul>
                    {linkItems ?? "loading..."}
                </ul>
            </div>
    )
}

