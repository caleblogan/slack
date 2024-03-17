import pool from "../db"
import ChannelModel from "./ChannelModel"
import WorkspaceModel from "./WorspaceModel"

export type ApiUser = UserModel

export type WorkspacesUsersModel = {
    workspaces_id: string
    users_id: string
    created_at: Date
}

export type ChannelsUsersModel = {
    channels_id: string
    users_id: string
    created_at: Date
}

export class UserModel {
    id: string
    email: string
    name: string
    username: string
    avatar_url?: string
    constructor(id: string, email: string, name: string, username: string, avatar_url?: string) {
        this.id = id
        this.email = email
        this.name = name
        this.username = username
        this.avatar_url = avatar_url
    }
    static async listWorkspaces(userId: string) {
        const queryResult = await pool.query(
            'SELECT * FROM workspaces_users JOIN workspaces on workspaces.id=workspaces_users.workspaces_id WHERE users_id = $1',
            [userId])
        return queryResult.rows as (WorkspacesUsersModel & WorkspaceModel)[]
    }
    static async listChannels(userId: string, workspaceId: string) {
        const queryResult = await pool.query(
            'SELECT * FROM channels_users JOIN channels on channels.id=channels_users.channels_id WHERE users_id = $1 AND channels.workspace_id = $2',
            [userId, workspaceId])
        return queryResult.rows as (ChannelModel & ChannelsUsersModel)[]
    }
}
