import pool from '../db'
import { generateUrlUUID } from '../uuids'

export default class ChannelModel {
    public id: string
    public name: string
    public user_id: string
    public workspace_id: string
    public topic: string = ""
    public description: string = ""
    public is_private: boolean = false
    constructor(
        props: ChannelModel
    ) {
        this.id = props.id
        this.name = props.name
        this.user_id = props.user_id
        this.workspace_id = props.workspace_id
        this.topic = props.topic
        this.description = props.description
        this.is_private = props.is_private
    }

    // TODO: enforce permissions - only a memmber of the workspace can create a channel
    static async create(userId: string, name: string, workspaceId: string, topic: string, description: string, isPrivate: boolean) {
        console.log("ISPRIVATE: ", isPrivate)
        const queryResult = await pool.query(
            'INSERT INTO channels (id, name, user_id, workspace_id, topic, description, is_private) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
            [generateUrlUUID(), name, userId, workspaceId, topic, description, isPrivate ?? false])
        console.log(queryResult.rows[0])
        return new ChannelModel(queryResult.rows[0])
    }

    // TODO: enforce permissions - only a memmber of the workspace can list channel
    static async list(userId: string, workspaceId: string) {
        const queryResult = await pool.query(
            'SELECT * FROM channels WHERE user_id = $1 AND workspace_id = $2',
            [userId, workspaceId])
        console.log(queryResult.rows)
        return queryResult.rows.map((row: any) => new ChannelModel(row))
    }
}
