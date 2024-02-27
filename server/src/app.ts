import dotenv from "dotenv"
import path from "path"
import express, { Request, Response } from "express"
import cors from "cors"
import * as uuid from "uuid"
import expressSession from "express-session"
import pgSession from "connect-pg-simple"
import os from "os"

// TODO: move to config file so order of precedence is clear
dotenv.config({ path: path.join(os.homedir(), ".env", "authapp.env") })
import pool from "./db"
import { asyncWrapper } from "./middleware"

if (!process.env.SESSION_SECRET) {
    throw new Error("SESSION_SECRET is not set")
}

const app = express()
const port = process.env.PORT || 3000
const store = pgSession(expressSession)

app.use(express.json())
app.use(cors({ credentials: true, origin: true }));
app.use(expressSession({
    store: new store({
        pool: pool
    }),
    secret: process.env.SESSION_SECRET,
    resave: false,
    cookie: { maxAge: 30 * 24 * 60 * 60 * 1000 }, // 30 days
    saveUninitialized: false
}));

export type ApiUser = Omit<UserModel, "passwordhash">

declare global {
    namespace Express {
        interface Locals {
        }
        interface Request {
        }
    }
}
declare module 'express-session' {
    interface SessionData {
        user?: ApiUser
        githubToken?: string
    }
}

app.get('/session', (req, res) => {
    res.json(req.session || {})
})

app.get('/logout', asyncWrapper(async (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error(err)
            res.json({ message: 'error logging out' })
        }
        res.clearCookie('connect.sid')
        res.json({ message: 'logged out' })
    })
}))

app.get('/me', authMiddleware, asyncWrapper(async (req, res, next) => {
    return res.json({ user: req.session.user })
}))

app.get('/secret', authMiddleware, asyncWrapper(async (req, res, next) => {
    res.json("You have access to the secret #asdjfkasjdfkjasdfj")
}))

interface UserModel {
    id: string
    email: string
    name: string
}


function authMiddleware(req: Request, res: Response, next: Function) {
    if (req.session.user) {
        next()
    } else {
        res.status(401).json({ error: "Not Authenticated" })
    }
}

// client_id=*****&redirect_uri=http://localhost:3000/auth/callback/github&state=1234akjalksdjf&scope=user:email
app.get('/auth/login/github', (req, res) => {
    const redirectUri = encodeURIComponent('http://localhost:3000/auth/callback/github')
    const state = uuid.v4()
    const scope = encodeURIComponent('user:email')
    const githubLogin = `https://github.com/login/oauth/authorize?client_id=${process.env.GITHUB_CLIENT_ID}&redirect_uri=${redirectUri}&state=${state}&scope=${scope}`
    res.json({ url: githubLogin })
})

app.get('/auth/callback/github', asyncWrapper(async (req, res, next) => {
    const { code, state } = req.query
    console.log("AUTH CALLBACK", code, state)
    // Todo: validate state to prevent CSRF
    // if (state !== req.session.state) {
    // }
    const response = await fetch('https://github.com/login/oauth/access_token', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            client_id: process.env.GITHUB_CLIENT_ID,
            client_secret: process.env.GITHUB_CLIENT_SECRET,
            code: code
        }),
    });
    const data = await response.json()
    console.log(data)
    // get access token
    const accessToken = data.access_token
    console.log("TOKE:", accessToken)
    req.session.githubToken = accessToken
    // get email from github
    const email = await githubApiGetEmail(accessToken)
    console.log("email:", email)
    // check if email exists in db
    const userQuery = await pool.query('SELECT * FROM users WHERE email = $1', [email])
    let user: ApiUser = userQuery.rows[0]
    // - if not, create user
    if (!user) {
        console.log("CREATING USER")
        const userCreateQuery = await pool.query('INSERT INTO users (id, email, name, role) VALUES ($1, $2, $3, $4) RETURNING *', [uuid.v4(), email, "none", "user"])
        user = userCreateQuery.rows[0]
    }
    // add user to session
    req.session.user = user
    res.redirect("http://localhost:5173")
}));

app.get('/github/me', asyncWrapper(async (req, res, next) => {
    if (!req.session.githubToken) { return next(new Error("No token")) }
    res.json(await githubApiGetUser(req.session.githubToken))
}))

app.get('/github/email', asyncWrapper(async (req, res, next) => {
    if (!req.session.githubToken) { return next(new Error("No token")) }
    const email = await githubApiGetEmail(req.session.githubToken)
    res.json({ email })
}))

async function githubApiGetEmail(token: string): Promise<string> {
    const response = await fetch('https://api.github.com/user/emails', {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    })
    const data = await response.json()
    return data[0]?.email
}

async function githubApiGetUser(token: string) {
    const response = await fetch('https://api.github.com/user', {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    })
    return await response.json()
}

app.use((err: any, req: any, res: any, next: Function) => {
    if (err) {
        console.error(err)
        res.status(500).json({ error: 'Internal Server Error' })
    }
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})
