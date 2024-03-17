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
    if (!workspaceId || typeof workspaceId !== "string") {
        res.status(400).json({ errors: [{ type: "validation", name: "workspaceId", message: "workspaceId query parameter is required" }] })
        return
    }
    const channels = await ChannelModel.list(userId, workspaceId);
    res.json({ channels })
}))

router.delete('/:channelId', authMiddleware, asyncWrapper(async (req, res, next) => {
    const userId = req.session.user?.id!
    const { channelId } = req.params
    const channel = await ChannelModel.delete(userId, channelId);
    res.json({ channel })
}))

router.put('/:channelId', authMiddleware, asyncWrapper(async (req, res, next) => {
    const userId = req.session.user?.id!
    const { name, topic, description, is_private } = req.body
    const { channelId } = req.params
    if (!name) {
        const errors = []
        if (!name) errors.push({ type: "validation", name: "name", message: "name is required" })
        res.status(400).json({ errors })
        return
    }
    const channel = await ChannelModel.update(userId, channelId, name, topic, description, is_private);
    res.json({ channel })
}))

router.post('/:channelId/users', authMiddleware, asyncWrapper(async (req, res, next) => {
    const userId = req.session.user?.id!
    const { user_id: idToAdd } = req.body
    if (!idToAdd) {
        const errors = []
        if (!idToAdd) errors.push({ type: "validation", name: "userId", message: "userId is required" })
        res.status(400).json({ errors })
        return
    }
    const channel = await ChannelModel.addUser(userId, req.params.channelId, idToAdd);
    res.json({ channel })
}))

router.get('/:channelId/users', authMiddleware, asyncWrapper(async (req, res, next) => {
    const userId = req.session.user?.id!
    const users = await ChannelModel.listUsers(userId, req.params.channelId);
    res.json({ users })
}))

router.get('/:channelId/messages', authMiddleware, asyncWrapper(async (req, res, next) => {
    const userId = req.session.user?.id!
    const messages = await ChannelModel.listMessages(userId, req.params.channelId);
    res.json({ messages })
}))

export default router