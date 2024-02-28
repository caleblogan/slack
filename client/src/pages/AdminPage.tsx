import { useContext, useEffect, useState } from "react"
import { createLink, deleteLink, getLinks, getPage, updateLink, updatePage } from "../api/api"
import { Link } from "../../../server/src/controllers/links"
import { useNavigate } from "react-router-dom"
import { UserContext } from "../context"
import { Button } from "@/components/ui/button"

export default function AdminPage() {
    return (
        <div className="bg-slate-100 rounded text-gray-900 flex flex-col items-center">
            <h1 className="text-4xl p-4">Admin Page</h1>
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
    return <form className="mb-8 border-b-2 pb-8" onSubmit={handleSubmit}>
        <h2 className="text-lg">
            Check out your public bage {""}
            <a className="text-emerald-700" href={user?.username} target="_blank">{user?.username}</a>
        </h2>
        <h2 className="text-2xl mt-5">Customize Your Page</h2>
        <div>
            <label className="mt-4 w-100" htmlFor="background-color">
                <div className="text-md mr-4 mb-1">background color</div>
                <input
                    className="border-2 border-gray-300 rounded-md "
                    type="color"
                    id="background-color"
                    name="background-color"
                    onChange={(e) => setBgColor(e.target.value)}
                    value={bgColor}
                />
            </label>
        </div>
        <div>
            <label className="mt-4" htmlFor="bio">
                <div className="text-md mr-4 mb-1">bio</div>
                <textarea
                    className="border-2 border-gray-300 rounded-md p-2 w-96 h-36"
                    id="bio" name="bio"
                    value={bio}
                    onChange={e => setBio(e.target.value)}
                    maxLength={180}
                />
            </label>
        </div>
        <Button className="mt-4" type="submit">Save</Button>
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
        <h2 className="text-2xl mt-5">Links</h2>
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
    return <li className="list-none m-4 text-lg" key={link.id}>
        {
            editing
                ? <form onSubmit={handleSubmit}>
                    <label className="" htmlFor="name">
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
                    <Button>Save</Button>
                    <Button onClick={reset}>Cancel</Button>
                </form>
                : <>
                    <a className="mr-2 w-52 inline-block" href={link.url}>{link.name}</a>
                    <label className="mr-2" htmlFor="active">Active
                        <input className="mr-2 ml-2" type="checkbox" checked={active} onChange={e => {
                            setEditing(true)
                            setActive(e.target.checked)
                        }} />
                    </label>
                    <Button className="mr-2" onClick={() => setEditing(true)}>Edit</Button>
                    <Button onClick={handleDelete}>Delete</Button>
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
            setName("")
            setUrl("")
        } catch (error) {
            console.log("error", error)
        }
    }

    return (
        <div className="border-t-2 mt-10 mb-10">
            {inputVisible
                ? <form onClick={handleSubmit}>
                    <label className="block mt-8" htmlFor="name">
                        <span className="mr-4">Name</span>
                        <input className="border-2 p-2 border-gray-300 h-8 rounded-md" type="text" id="name" name="name" value={name} onChange={e => setName(e.target.value)} />
                    </label >
                    <label className="block mt-8" htmlFor="url">
                        <span className="mr-2">URL</span>
                        <input className="border-2 p-2 border-gray-300 h-8 rounded-md" type="url" id="url" name="url" value={url} onChange={e => setUrl(e.target.value)} />
                    </label>
                    <div className="mt-4">
                        <Button className="mr-4">Save</Button>
                        <Button onClick={() => setInputVisible(false)}>Cancel</Button>
                    </div>
                </form >
                : <>
                    <Button className="mt-8 mb-8" onClick={() => setInputVisible(true)}>Add Link</Button>
                </>
            }
        </div>
    )
}
