import express from "express"
import cors from "cors"
import * as uuid from "uuid"
import expressSession from "express-session"
import pgSession from "connect-pg-simple"

import pool from "./db"
import { asyncWrapper, authMiddleware } from "./middleware"
import { GithubApi } from "./githubapi"
import { randomInt } from "crypto"
import { config } from "./config"


const app = express()
const port = config.port
const store = pgSession(expressSession)

app.use((req, res, next) => {
    console.log(process.env)

    next()
})
app.use(express.json())
app.use(cors({ credentials: true, origin: true }));
app.use(expressSession({
    store: new store({
        pool: pool
    }),
    secret: config.sessionSecret,
    resave: false,
    cookie: { maxAge: 30 * 24 * 60 * 60 * 1000 }, // 30 days
    saveUninitialized: false
}));

export type ApiUser = UserModel
export interface UserModel {
    id: string
    email: string
    name: string
}

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
        hi?: string
    }
}

app.get('/session', (req, res) => {
    pool.query('SELECT * from users where email = $1', ["dank"], (err, res) => {
        console.log(err, res.rows[0])
    })
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


app.get('/auth/login/github', (req, res) => {
    const redirectUri = encodeURIComponent('http://localhost:3000/auth/callback/github')
    const state = uuid.v4()
    const scope = encodeURIComponent('user:email')
    const githubLogin = `https://github.com/login/oauth/authorize?client_id=${config.githubClientId}&redirect_uri=${redirectUri}&state=${state}&scope=${scope}`
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
            client_id: config.githubClientId,
            client_secret: config.githubClientSecret,
            code: code
        }),
    });
    const data = await response.json()
    console.log(data)
    // get access token
    const accessToken = data.access_token
    console.log("TOKEN:", accessToken)
    req.session.githubToken = accessToken
    // get email from github
    const email = await GithubApi.getEmail(accessToken)
    console.log("email:", email)
    // check if email exists in db
    const userQuery = await pool.query('SELECT * FROM users WHERE email = $1', [email])
    let user: ApiUser = userQuery.rows[0]
    // - if not, create user
    if (!user) {
        console.log("CREATING USER")
        const username = generateSafeBase64(10)
        const userCreateQuery = await pool.query('INSERT INTO users (id, username, email, name) VALUES ($1,$2, $3, $4) RETURNING *', [uuid.v4(), username, email, "null"])
        user = userCreateQuery.rows[0]
    }
    // add user to session
    req.session.user = user
    res.redirect("http://localhost:5173")
}));

app.get('/github/me', asyncWrapper(async (req, res, next) => {
    if (!req.session.githubToken) { return next(new Error("No token")) }
    res.json(await GithubApi.getUser(req.session.githubToken))
}))

app.get('/github/email', asyncWrapper(async (req, res, next) => {
    if (!req.session.githubToken) { return next(new Error("No token")) }
    const email = await GithubApi.getEmail(req.session.githubToken)
    res.json({ email })
}))


app.use((err: any, req: any, res: any, next: Function) => {
    if (err) {
        console.error(err)
        res.status(500).json({ error: 'Internal Server Error' })
    }
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})
function generateSafeBase64(length: number) {
    const safeChars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-_"
    const result: string[] = []
    for (let i = 0; i < length; i++) {
        result.push(safeChars[randomInt(0, safeChars.length)])
    }
    return result.join('')
}

