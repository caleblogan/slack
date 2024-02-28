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
            key={link.id}
            style={{ cursor: "pointer", fontSize: "1.5em", padding: ".5em 1em", color: "white", width: "18em", border: "1px solid white" }}
        ><a style={{ color: "white" }} href={link.url}>{link.name}</a></li>
    ))
    return (
        !page
            ? <div>Loading...</div>
            : <div style={{
                background: `linear-gradient(330deg, rgba(0,0,0,0.7), ${page?.background_color})`,
                top: 0, left: 0, position: "absolute", width: "100vw", height: "100vh", backgroundColor: page?.background_color
            }}>
                <h1>{page?.bio}</h1>
                <ul style={{ gap: "1em", flexDirection: "column", display: "flex", alignItems: "center", listStyle: "none" }}>
                    {linkItems ?? "loading..."}
                </ul>
            </div>
    )
}

