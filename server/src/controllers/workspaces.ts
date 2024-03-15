import { Router } from "express"

import { asyncWrapper, authMiddleware } from "../middleware"
import WorkspaceModel from "../models/WorspaceModel"

const router = Router()

router.post('/', authMiddleware, asyncWrapper(async (req, res, next) => {
    const userId = req.session.user?.id!
    const { name } = req.body
    if (!name) {
        res.status(400).json({ errors: [{ type: "validation", name: "name", message: "name is required" }] })
    }

    const workspace = await WorkspaceModel.create(userId, name)
    res.json({ workspace })
}))


export default router