import express from "express"
import cors from "cors"
import expressSession from "express-session"
import pgSession from "connect-pg-simple"

import pool from "./db"
import { envOnly, requireJSONHeader } from "./middleware"
import { config } from "./config"
import authRouter from "./controllers/auth"
import debugRouter from "./controllers/debug"
import workspacesRouter from "./controllers/workspaces"
import channelsRouter from "./controllers/channels"
import messagesRouter from "./controllers/messages"
import usersRouter from "./controllers/users"
import { ApiUser } from "./models/UserModel"

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

const app = express()
const port = config.port
const store = pgSession(expressSession)

app.use(express.json())
// app.use(requireJSONHeader)
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

app.use('/auth', authRouter)
app.use('/workspaces', workspacesRouter)
app.use('/channels', channelsRouter)
app.use('/messages', messagesRouter)
app.use('/users', usersRouter)
app.use('/debug', envOnly("dev"), debugRouter)


app.use((err: any, req: any, res: any, next: Function) => {
    if (err) {
        console.error(err)
        res.status(500).json({ error: 'Internal Server Error' })
    }
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})

