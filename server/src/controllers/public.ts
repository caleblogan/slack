import { Router } from "express";
import { asyncWrapper, authMiddleware } from "../middleware";
import pool from "../db";
import { Link, getPageId } from "./links";


const router = Router()
export default router


router.get('/page/:username', asyncWrapper(async (req, res) => {
    const userId = await getUserId(req.params.username)
    const query = await pool.query("SELECT * FROM pages WHERE user_id = $1", [userId]);
    res.json({ page: query.rows[0] })
}))

router.get('/links/:username', asyncWrapper(async (req, res) => {
    const userId = await getUserId(req.params.username)
    const pageId = await getPageId(userId)
    const query = await pool.query("SELECT * FROM links WHERE page_id = $1", [pageId]);
    const links = query.rows as Link[]
    res.json({ links: links.filter(link => link.active) })
}))

async function getUserId(username: string) {
    const query = await pool.query("SELECT id FROM users WHERE username = $1", [username]);
    if (query.rows.length === 0) {
        console.log("User not found", username)
        throw new Error("User not found")
    }
    return query.rows[0].id
}

