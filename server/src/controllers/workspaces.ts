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

    // TODO: this should be a transaction
    const workspace = await WorkspaceModel.create(userId, name)
    await WorkspaceModel.addUser(userId, workspace.id, userId)
    res.json({ workspace })
}))

router.get('/:workspaceId', authMiddleware, asyncWrapper(async (req, res, next) => {
    const userId = req.session.user?.id!
    const workspace = await WorkspaceModel.get(userId, req.params.workspaceId)
    res.json({ workspace })
}))

router.post('/:workspaceId/users', authMiddleware, asyncWrapper(async function addUser(req, res, next) {
    const ownersId = req.session.user?.id!
    const { user_id } = req.body
    if (!user_id) {
        res.status(400).json({ errors: [{ type: "validation", name: "userId", message: "userId is required" }] })
    }

    const workspace = await WorkspaceModel.addUser(ownersId, req.params.workspaceId, user_id)
    res.json({ workspace })
}))

router.delete('/:workspaceId/users', authMiddleware, asyncWrapper(async function addUser(req, res, next) {
    const ownersId = req.session.user?.id!
    const { user_id } = req.body
    if (!user_id) {
        res.status(400).json({ errors: [{ type: "validation", name: "userId", message: "userId is required" }] })
    }

    const workspace = await WorkspaceModel.removeUser(ownersId, req.params.workspaceId, user_id)
    res.json({ workspace })
}))

// list users
router.get('/:workspaceId/users', authMiddleware, asyncWrapper(async function addUser(req, res, next) {
    const userId = req.session.user?.id!
    const users = await WorkspaceModel.listUsers(userId, req.params.workspaceId)
    res.json({ users })
}))


export default router