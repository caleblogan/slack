import MessageModel from "../../../server/src/models/MessageModel"
import { UserModel } from "../../../server/src/models/UserModel"
import Api from "./api"

export async function listMessages(channelId: string): Promise<(MessageModel & UserModel)[]> {
    const response = await Api.get(`/channels/${channelId}/messages`)
    return response?.messages
}

export namespace ChannelApi {
    export async function create(workspaceId: string, name: string) {
        const response = await Api.post(`/channels`, { body: JSON.stringify({ name, workspace_id: workspaceId }) })
        return response?.channel
    }
}