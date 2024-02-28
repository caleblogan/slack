import { Router } from "express";
import { asyncWrapper, authMiddleware, envOnly } from "../middleware";
import pool from "../db";
import { v4 as uuid } from "uuid"

const router = Router()
export default router

export interface Page {
    id: string
    user_id: string
    bio: string
    background_color: string
    created_at: Date
    updated_at: Date
}

router.post('/', envOnly("dev"), authMiddleware, asyncWrapper(async (req, res) => {
    const { bio, background_color } = req.body
    const query = await pool.query(
        "INSERT INTO pages (id, user_id, bio, background_color) VALUES ($1, $2, $3, $4) RETURNING *",
        [uuid(), req.session.user?.id, bio, background_color])
    res.json({ page: query.rows[0] })
}))

router.get('/', authMiddleware, asyncWrapper(async (req, res) => {
    const query = await pool.query("SELECT * FROM pages WHERE user_id = $1", [req.session.user?.id]);
    if (query.rows.length === 0) {
        return res.json({ page: null })
    }
    res.json({ page: query.rows[0] })
}))

router.put('/', authMiddleware, asyncWrapper(async (req, res) => {
    const { bio, background_color } = req.body
    const query = await pool.query(
        "UPDATE pages SET bio=$1, background_color=$2, updated_at=NOW() WHERE user_id=$3 RETURNING *",
        [bio, background_color, req.session.user?.id])
    res.json({ page: query.rows[0] })
}))