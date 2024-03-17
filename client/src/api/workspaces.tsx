import WorkspaceModel from "../../../server/src/models/WorspaceModel"
import Api from "./api"

export async function listWorkspaces(): Promise<WorkspaceModel[]> {
    const response = await Api.get(`/users/workspaces`)
    return response?.workspaces
}

export async function getWorkpace(workspaceId: string): Promise<WorkspaceModel> {
    const response = await Api.get(`/workspaces/${workspaceId}`)
    return response?.workspace
}