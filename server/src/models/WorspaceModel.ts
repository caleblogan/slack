import pool from '../db'
import { generateUrlUUID } from '../uuids'

export default class WorkspaceModel {
    constructor(
        public id: string,
        public name: string,
        public user_id: string
    ) { }

    static async create(userId: string, name: string) {
        const queryResult = await pool.query(
            'INSERT INTO workspaces (id, name, user_id) VALUES ($1, $2, $3) RETURNING *',
            [generateUrlUUID(), name, userId])
        const workspaceRaw = queryResult.rows[0]
        return new WorkspaceModel(workspaceRaw.id, workspaceRaw.name, workspaceRaw.user_id)
    }

    static async get(userId: string, workspaceId: string) {
        await authMemberOfWorkspace(workspaceId, userId)
        const queryResult = await pool.query(
            'SELECT * FROM workspaces WHERE id = $1',
            [workspaceId])
        return queryResult.rows[0] as WorkspaceModel
    }

    static async addUser(ownersId: string, workspaceId: string, userId: string) {
        await authOwnsWorkspace(workspaceId, ownersId)
        const queryResult = await pool.query(
            'INSERT INTO workspaces_users (workspaces_id, users_id) VALUES ($1, $2) RETURNING *',
            [workspaceId, userId])
        const workspaceRaw = queryResult.rows[0]
        return new WorkspaceModel(workspaceRaw.id, workspaceRaw.name, workspaceRaw.user_id)
    }

    static async removeUser(ownersId: string, workspaceId: string, userId: string) {
        await authOwnsWorkspace(workspaceId, ownersId)
        const query = await pool.query(
            'DELETE FROM workspaces_users WHERE workspaces_id = $1 AND users_id = $2',
            [workspaceId, userId])
        return query.rows[0] as WorkspaceModel
    }

    static async listUsers(userId: string, workspaceId: string) {
        await authMemberOfWorkspace(workspaceId, userId)
        const queryResult = await pool.query(
            'SELECT * FROM workspaces_users WHERE workspaces_id = $1',
            [workspaceId])
        return queryResult.rows
    }
}

async function authOwnsWorkspace(workspaceId: string, userId: string) {
    const queryResult = await pool.query(
        'SELECT * FROM workspaces WHERE id = $1 AND user_id = $2',
        [workspaceId, userId])
    if (queryResult.rowCount === 0) {
        throw new Error('Unauthorized')
    }
}

export async function authMemberOfWorkspace(workspaceId: string | undefined, userId: string) {
    const queryResult = await pool.query(
        'SELECT * from workspaces_users WHERE workspaces_id=$1 AND users_id=$2',
        [workspaceId, userId]
    )
    if (queryResult.rowCount === 0) {
        throw new Error('Unauthorized')
    }
}