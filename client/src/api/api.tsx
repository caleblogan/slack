import { ApiUser } from "../../../server/src/models/UserModel"

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

export async function logout(): Promise<{ message: string }> {
    const response = await fetch(`${BASE_URL}/auth/logout`, {
        method: "GET",
        credentials: "include"
    })
    return await response.json()
}

export async function loginAnon(): Promise<ApiUser> {
    const response = await fetch(`${BASE_URL}/auth/login/anon`, {
        method: "POST",
        credentials: "include"
    })
    return await response.json()
}