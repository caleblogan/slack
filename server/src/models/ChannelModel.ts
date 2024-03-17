import pool from '../db'
import { generateUrlUUID } from '../uuids'
import { authMemberOfWorkspace } from './WorspaceModel'

interface ChannelsUsersModel {
    channels_id: string
    users_id: string
    created_at: Date
}

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

    static async delete(userId: string, channelId: string) {
        const queryResult = await pool.query(
            'DELETE FROM channels WHERE user_id=$1 AND id=$2 RETURNING *',
            [userId, channelId])
        return queryResult.rows[0] as ChannelModel
    }

    static async update(userId: string, channelId: string, name: string, topic: string, description: string, isPrivate: boolean) {
        const queryResult = await pool.query(
            `UPDATE channels 
            set name=$3, topic=$4, description=$5, is_private=$6
             WHERE user_id=$1 AND id=$2 RETURNING *`,
            [userId, channelId, name, topic, description, isPrivate ?? false]) // TODO: Defaults/validation should be in one place
        return queryResult.rows[0] as ChannelModel
    }

    static async getChannel(channelId: string) {
        const queryResult = await pool.query(
            'SELECT * FROM channels WHERE id = $1',
            [channelId])
        return queryResult.rows[0] as ChannelModel | undefined
    }

    static async addUser(userId: string, channelId: string, userIdToAdd: string) {
        await authMemberOfChannel(channelId, userId)
        const { workspace_id } = await this.getChannel(channelId) ?? {}
        await authMemberOfWorkspace(workspace_id, userIdToAdd)
        const query = await pool.query(
            'INSERT INTO channels_users (channels_id, users_id) VALUES ($1, $2) RETURNING *',
            [channelId, userIdToAdd])
        return query.rows[0] as ChannelsUsersModel
    }

    static async listUsers(userId: string, channelId: string) {
        await authMemberOfChannel(channelId, userId)
        const query = await pool.query(
            'SELECT * FROM channels_users JOIN users ON users.id = users_id WHERE channels_id = $1',
            [channelId])
        return query.rows as (ChannelsUsersModel & ChannelModel)[]
    }

}

async function authMemberOfChannel(channelId: string, userId: string) {
    const query = await pool.query(
        'SELECT * FROM channels_users WHERE channels_id = $1 AND users_id = $2',
        [channelId, userId]
    )
    if (query.rowCount === 0) {
        throw new Error('Unauthorized')
    }
}