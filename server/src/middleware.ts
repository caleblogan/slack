import { Handler, Request, Response } from "express"

export function asyncWrapper(func: Handler): Handler {
    return (req, res, next) => {
        Promise.resolve(func(req, res, next))
            .catch(next)
    }
}

export function authMiddleware(req: Request, res: Response, next: Function) {
    if (req.session.user) {
        next()
    } else {
        res.status(401).json({ error: "Not Authenticated" })
    }
}