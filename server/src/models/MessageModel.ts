import pool from '../db'
import { generateUrlUUID } from '../uuids'

export default class MessageModel {
    public id: string
    public text: string
    public user_id: string
    public channel_id: string
    public created_at: string
    public updated_at: string
    constructor(
        props: MessageModel
    ) {
        this.id = props.id
        this.text = props.text
        this.user_id = props.user_id
        this.channel_id = props.channel_id
        this.created_at = props.created_at
        this.updated_at = props.updated_at
    }

    // TODO: enforce permissions
    static async create(userId: string, text: string, channelId: string) {
        const queryResult = await pool.query(
            'INSERT INTO messages (id, text, user_id, channel_id) VALUES ($1, $2, $3, $4) RETURNING *',
            [generateUrlUUID(), text, userId, channelId])
        return new MessageModel(queryResult.rows[0])
    }

    // TODO: enforce permissions
    static async list(userId: string, channelId: string) {
        const queryResult = await pool.query(
            'SELECT * FROM messages WHERE user_id = $1 AND channel_id = $2',
            [userId, channelId])
        return queryResult.rows.map((row: any) => new MessageModel(row))
    }

    static async delete(userId: string, messageId: string) {
        const queryResult = await pool.query(
            'DELETE FROM messages WHERE user_id=$1 AND id=$2 RETURNING *',
            [userId, messageId])
        return queryResult.rows[0] as MessageModel
    }

    static async update(userId: string, messageId: string, text: string) {
        const queryResult = await pool.query(
            `UPDATE messages
                set text=$3
                WHERE user_id=$1 AND id=$2 RETURNING *`,
            [userId, messageId, text])
        return queryResult.rows[0] as MessageModel
    }
}
