import { useContext, useEffect, useState } from "react"
import { createLink, deleteLink, getLinks, getPage, updateLink, updatePage } from "../api/api"
import { Link } from "../../../server/src/controllers/links"
import { useNavigate } from "react-router-dom"
import { UserContext } from "../context"

export default function AdminPage() {

    return (
        <div>
            <h1>Admin Page</h1>
            <PageCustomizationForm />
            <Links />
        </div>
    )
}

function PageCustomizationForm() {
    const [bgColor, setBgColor] = useState("#FFFFFF")
    const [bio, setBio] = useState("")
    const user = useContext(UserContext);
    const navigate = useNavigate();
    useEffect(() => {
        if (!user) {
            navigate("/")
        }
    }, [user])

    useEffect(() => {
        getPage().then((page) => {
            setBgColor(page.background_color)
            setBio(page.bio)
        })
    }, [])

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        try {
            const result = await updatePage({ bio, background_color: bgColor })
            if (result) {
                console.log(result)
            }
        } catch (error) {
            console.log("error", error)
        }
    }
    return <form onSubmit={handleSubmit}>
        <h2>Check out your public bage <a href={user?.username} target="_blank">{user?.username}</a></h2>
        <h2>Customize Your Page</h2>
        <label htmlFor="background-color">
            <input
                type="color"
                id="background-color"
                name="background-color"
                onChange={(e) => setBgColor(e.target.value)}
                value={bgColor}
            />
            {" "} background color
        </label>
        <label htmlFor="bio">
            <textarea
                id="bio" name="bio"
                value={bio}
                onChange={e => setBio(e.target.value)}
                maxLength={180}
            />
            {" "} bio
        </label>
        <button type="submit">Save</button>
    </form>
}

function Links() {
    const [links, setLinks] = useState<Link[]>([])
    useEffect(() => {
        getLinks().then((links) => {
            console.log(links)
            setLinks(links)
        })
    }, [])
    function handleAddLink(link: Link) {
        setLinks([...links, link])
    }
    function handleDelete(id: string) {
        setLinks(links.filter(l => l.id !== id))
    }
    function handleUpdate(link: Link) {
        setLinks(links.map(oldLink => {
            if (oldLink.id === link.id) {
                return link
            }
            return oldLink
        }))
    }
    const linkItems = links.map((link) =>
        <LinkEditor
            key={link.id} link={link}
            onDelete={handleDelete}
            onUpdate={handleUpdate}
        />
    )
    return <div>
        <h2>Links</h2>
        {linkItems}
        <CreateLink addLink={handleAddLink} />
    </div>
}

function LinkEditor({ link, onDelete, onUpdate }: { link: Link, onDelete: (id: string) => void, onUpdate: (link: Link) => void }) {
    const [editing, setEditing] = useState(false)
    const [name, setName] = useState(link.name)
    const [url, setUrl] = useState(link.url)
    const [active, setActive] = useState(link.active)
    function reset() {
        setEditing(false)
        setName(link.name)
        setUrl(link.url)
        setActive(link.active)
    }
    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        const result = await updateLink({ id: link.id, name, url, active })
        onUpdate(result)
        setEditing(false)
        console.log(result)
    }
    async function handleDelete() {
        console.log("delete")
        const result = await deleteLink({ id: link.id })
        console.log(result)
        onDelete(link.id)
    }
    useEffect(() => {
        reset()
    }, [link])
    return <li key={link.id}>
        {
            editing
                ? <form onSubmit={handleSubmit}>
                    <label htmlFor="name">
                        <input type="text" id="name" name="name" value={name} onChange={e => setName(e.target.value)} />
                        {" "} Name
                    </label >
                    <label htmlFor="url">
                        <input type="url" id="url" name="url" value={url} onChange={e => setUrl(e.target.value)} />
                        {" "} URL
                    </label>
                    <label htmlFor="active">
                        <input type="checkbox" id="active" name="active" checked={active} onChange={e => setActive(e.target.checked)} />
                        {" "} Active
                    </label>
                    <button>Save</button>
                    <button onClick={reset}>Cancel</button>
                </form>
                : <>
                    <a href={link.url}>{link.name}</a>
                    <input type="checkbox" checked={active} onChange={e => {
                        setEditing(true)
                        setActive(e.target.checked)
                    }} />
                    <button onClick={() => setEditing(true)}>Edit</button>
                    <button onClick={handleDelete}>Delete</button>
                </>
        }
    </li>
}

function CreateLink({ addLink }: { addLink: (link: Link) => void }) {
    const [inputVisible, setInputVisible] = useState(false)
    const [name, setName] = useState("")
    const [url, setUrl] = useState("")
    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        if (name === "" || url === "") {
            console.log("Name and URL are required")
            return
        }
        console.log("Saving...")
        try {
            const result = await createLink({ name, url })
            addLink(result)
        } catch (error) {
            console.log("error", error)
        }
    }

    return (
        inputVisible
            ? <form onClick={handleSubmit}>
                <label htmlFor="name">
                    <input type="text" id="name" name="name" value={name} onChange={e => setName(e.target.value)} />
                    {" "} Name
                </label >
                <label htmlFor="url">
                    <input type="url" id="url" name="url" value={url} onChange={e => setUrl(e.target.value)} />
                    {" "} URL
                </label>
                <button>Save</button>
                <button onClick={() => setInputVisible(false)}>Cancel</button>
            </form >
            : <>
                <button onClick={() => setInputVisible(true)}>Add Link</button>
            </>
    )
}
