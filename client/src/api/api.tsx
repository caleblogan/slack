import { ApiUser } from "../../../server/src/app"
import { Link } from "../../../server/src/controllers/links"
import { Page } from "../../../server/src/controllers/page"

const BASE_URL = "http://localhost:3000"

export async function getMe(): Promise<ApiUser | null> {
    const response = await fetch(`${BASE_URL}/auth/me`, {
        method: "GET",
        credentials: "include"
    })
    const data = await response.json()
    return data?.user
}

export async function getUsers(): Promise<ApiUser[]> {
    const response = await fetch(`${BASE_URL}/users`, {
        method: "GET",
        credentials: "include"
    })
    const data = await response.json()
    return data?.users ?? []
}

export async function getGithubLogin(): Promise<string> {
    const response = await fetch(`${BASE_URL}/auth/login/github`)
    return (await response.json()).url
}

export async function getLinks(): Promise<Link[]> {
    const response = await fetch(`${BASE_URL}/links`, {
        credentials: "include"
    })
    const result = await response.json()
    return result.links
}

export async function createLink({ name, url }: { name: string, url: string }): Promise<Link> {
    const response = await fetch(`${BASE_URL}/links`, {
        method: "POST",
        credentials: "include",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            name,
            url
        })
    })
    const result = await response.json()
    return result.link
}
export async function updateLink({ id, name, url, active }: { id: string, name: string, url: string, active: boolean }): Promise<Link> {
    const response = await fetch(`${BASE_URL}/links/${id}`, {
        method: "PUT",
        credentials: "include",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            name,
            url,
            active
        })
    })
    const result = await response.json()
    return result.link
}

export async function deleteLink({ id }: { id: string }): Promise<Link> {
    const response = await fetch(`${BASE_URL}/links/${id}`, {
        method: "DELETE",
        credentials: "include",
        headers: {
            "Content-Type": "application/json"
        }
    })
    const result = await response.json()
    return result.link
}

export async function updatePage({ bio, background_color }: { bio: string, background_color: string }): Promise<Page> {
    const response = await fetch(`${BASE_URL}/page`, {
        method: "PUT",
        credentials: "include",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            bio,
            background_color
        })
    })
    const result = await response.json()
    return result.page
}
export async function getPage(): Promise<Page> {
    const response = await fetch(`${BASE_URL}/page`, {
        method: "GET",
        credentials: "include",
        headers: {
            "Content-Type": "application/json"
        }
    })
    const result = await response.json()
    return result.page
}
export async function getPagePublic(username: string): Promise<Page> {
    const response = await fetch(`${BASE_URL}/public/page/${username}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }
    })
    const result = await response.json()
    return result.page
}
export async function getLinksPublic(username: string): Promise<Link[]> {
    const response = await fetch(`${BASE_URL}/public/links/${username}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }
    })
    const result = await response.json()
    return result.links
}
