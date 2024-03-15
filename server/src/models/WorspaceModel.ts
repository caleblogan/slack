import pool from '../db'
import { generateUrlUUID } from '../uuids'

export default class WorkspaceModel {
    constructor(
        public id: string,
        public name: string,
        public user_id: string
    ) { }

    static async create(userId: string, name: string) {
        const queryResult = await pool.query('INSERT INTO workspaces (id, name, user_id) VALUES ($1, $2, $3) RETURNING *', [generateUrlUUID(), name, userId])
        const workspaceRaw = queryResult.rows[0]
        return new WorkspaceModel(workspaceRaw.id, workspaceRaw.name, workspaceRaw.user_id)
    }
}
