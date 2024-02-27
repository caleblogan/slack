import { Router } from "express";
import { asyncWrapper, authMiddleware } from "../middleware";
import pool from "../db";
import { v4 as uuid } from "uuid"

const router = Router()
export default router

router.post('/', authMiddleware, asyncWrapper(async (req, res) => {
    const { name, url } = req.body
    const pageId = await getPageId(req.session.user?.id ?? "")
    const query = await pool.query(
        "INSERT INTO links (id, page_id, name, url) VALUES ($1, $2, $3, $4) RETURNING *",
        [uuid(), pageId, name, url])
    res.json({ link: query.rows[0] })
}))

router.get('/', authMiddleware, asyncWrapper(async (req, res) => {
    const pageId = await getPageId(req.session.user?.id!)
    const query = await pool.query("SELECT * FROM links WHERE page_id= $1", [pageId]);
    res.json({ links: query.rows })
}))

router.put('/:id', authMiddleware, asyncWrapper(async (req, res) => {
    const { name, url, active } = req.body
    const pageId = await getPageId(req.session.user?.id || "")
    const query = await pool.query(
        "UPDATE links SET name=$1, url=$2, active=$3 WHERE page_id=$4 and id=$5 RETURNING *",
        [name, url, active, pageId, req.params.id])
    res.json({ link: query.rows[0] })
}))

router.delete('/:id', authMiddleware, asyncWrapper(async (req, res) => {
    const pageId = await getPageId(req.session.user?.id || "")
    const query = await pool.query(
        "DELETE FROM links WHERE page_id=$1 and id=$2 RETURNING *",
        [pageId, req.params.id])
    res.json({ link: query.rows[0] })
}))

async function getPageId(userId: string) {
    const pageQuery = await pool.query("SELECT * FROM pages WHERE user_id = $1", [userId]);
    if (pageQuery.rows.length === 0) {
        console.log("Page not found for user", userId, pageQuery.rows)
        throw new Error("Page not found")
    }
    return pageQuery.rows[0].id
}