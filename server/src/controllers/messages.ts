import { Router } from "express"

import { asyncWrapper, authMiddleware } from "../middleware"
import MessageModel from "../models/MessageModel"

const router = Router()

router.post('/', authMiddleware, asyncWrapper(async (req, res, next) => {
    const userId = req.session.user?.id!
    const { text, channel_id } = req.body
    if (!text) {
        const errors = []
        if (!text) errors.push({ type: "validation", name: "text", message: "text is required" })
        res.status(400).json({ errors })
        return
    }

    const message = await MessageModel.create(userId, text, channel_id);
    res.json({ message })
}))

router.get('/', authMiddleware, asyncWrapper(async (req, res, next) => {
    const userId = req.session.user?.id!
    const { channel_id } = req.query
    if (!channel_id || typeof channel_id !== "string") {
        res.status(400).json({ errors: [{ type: "validation", name: "channel_id", message: "workspaceId query parameter is required" }] })
        return
    }
    const messages = await MessageModel.list(userId, channel_id);
    res.json({ messages })
}))

router.delete('/:messageId', authMiddleware, asyncWrapper(async (req, res, next) => {
    const userId = req.session.user?.id!
    const { messageId } = req.params
    const message = await MessageModel.delete(userId, messageId);
    res.json({ message })
}))

router.put('/:messageId', authMiddleware, asyncWrapper(async (req, res, next) => {
    const userId = req.session.user?.id!
    const { text } = req.body
    const { messageId } = req.params
    if (!text) {
        const errors = []
        if (!text) errors.push({ type: "validation", name: "text", message: "text is required" })
        res.status(400).json({ errors })
        return
    }
    const channel = await MessageModel.update(userId, messageId, text);
    res.json({ channel })
}))

export default router