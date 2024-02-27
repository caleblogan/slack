// routes should only work in development mode
import { Router } from 'express'
import { asyncWrapper } from '../middleware'

const router = Router()
export default router

// debug
router.get('/session', (req, res) => {
    res.json(req.session || {})
})

router.get('/me', asyncWrapper(async (req, res, next) => {
    return res.json({ user: req.session.user })
}))