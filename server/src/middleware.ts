import { Handler } from "express"

export function asyncWrapper(func: Handler): Handler {
    return (req, res, next) => {
        Promise.resolve(func(req, res, next))
            .catch(next)
    }
}