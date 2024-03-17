import { Router } from 'express'
import { asyncWrapper, authMiddleware } from '../middleware';
import { UserModel } from '../models/UserModel';

const router = Router()
router.get('/workspaces', authMiddleware, asyncWrapper(async (req, res, next) => {
    const userId = req.session.user?.id!
    const workspaces = await UserModel.listWorkspaces(userId);
    res.json({ workspaces })
}))

router.get('/channels', authMiddleware, asyncWrapper(async (req, res, next) => {
    const userId = req.session.user?.id!
    const { workspaceId } = req.query
    if (!workspaceId || typeof workspaceId !== "string") {
        res.status(400).json({ errors: [{ type: "validation", name: "workspaceId", message: "workspaceId query parameter is required" }] })
        return
    }
    const channels = await UserModel.listChannels(userId, workspaceId);
    res.json({ channels })
}))

export default router
