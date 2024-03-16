import { Router } from "express"

import { asyncWrapper, authMiddleware } from "../middleware"
import ChannelModel from "../models/ChannelModel"

const router = Router()

router.post('/', authMiddleware, asyncWrapper(async (req, res, next) => {
    const userId = req.session.user?.id!
    const { name, topic, description, is_private, workspace_id } = req.body
    if (!name) {
        const errors = []
        if (!name) errors.push({ type: "validation", name: "name", message: "name is required" })
        if (!workspace_id) errors.push({ type: "validation", name: "workspace_id", message: "workspace_id is required" })
        res.status(400).json({ errors })
        return
    }

    const channel = await ChannelModel.create(userId, name, workspace_id, topic, description, is_private);
    res.json({ channel })
}))


router.get('/', authMiddleware, asyncWrapper(async (req, res, next) => {
    const userId = req.session.user?.id!
    const { workspaceId } = req.query
    console.log("workspaceId: ", workspaceId)
    if (!workspaceId || typeof workspaceId !== "string") {
        res.status(400).json({ errors: [{ type: "validation", name: "workspaceId", message: "workspaceId query parameter is required" }] })
        return
    }
    const channels = await ChannelModel.list(userId, workspaceId);
    res.json({ channels })
}))

export default router