import { axiosClient } from "../axiosClient"


interface GetGroupRequest{
    searchPhrase: string,
    pageNumber: number,
    pageSize: number,
    sortBy: string | null | undefined, 
    sortDirection: 0 | 1
}
interface GroupDataBad2{
    id: number,
    name: string | null,
    description: string | null,
    expirationDate: string | null,
    roles: string[],
    users: Users[],
    usersCount: number,
}
interface Users{
    id: number,
    firstName: string,
    lastName: string,
    email: string,
    roles: string[]
}
interface GroupData{
    id: number,
    name: string | null,
    description: string | null,
    expirationDate: string | null,
    usersCount: number,
    isUser: boolean,
    isAdmin: boolean,
    isModerator: boolean
}
interface GetGroupResponse{
    items: GroupData[],
    totalPages: number,
    itemsFrom: number,
    itemsTo: number,
    totalItemsCount: number
}

interface PostGroupRequest{
    name: string,
    description: string,
    expirationDate?: string,
    roleId: string[],
}

interface PutGroupRequestName{
    id: number,
    data: PutGroupDataName
}
interface PutGroupRequestDescription{
    id: number,
    data: PutGroupDataDescription
}
interface PutGroupRequestExpirationDate{
    id: number,
    data: PutGroupDataExpirationDate
}
interface PutGroupRequestRoles{
    id: number,
    data: PutGroupDataRoles
}

interface PutGroupDataName{
    name: string,
}
interface PutGroupDataDescription{
    description: string,
}
interface PutGroupDataExpirationDate{
    expirationDate: string,
}
interface PutGroupDataRoles{
    isAdmin: boolean,
    isModerator: boolean,
    isUser: boolean,
}
interface PostUserInGroupRequest{
    id: number,
    email: string,
}
interface DeleteUserInGroupRequest{
    id: number,
    email: string,
}


export function getGroups(request: GetGroupRequest){
    return axiosClient.get('/Group', 
    { params: request}).then(response => response.data as GetGroupResponse);
}

export function deleteGroup(id: number){
    return axiosClient.delete(`/Group/${id}`)
}

export function getGroup(id: number,request: GetGroupRequest){
    return axiosClient.get(`/Group/${id}`,
    { params: request}).then(response => (response.data as GroupDataBad2))
}

export function postGroup(request: PostGroupRequest){
    return axiosClient.post('/Group',request)
}
export function putGroupName(request: PutGroupRequestName){
    return axiosClient.put(`/Group/${request.id}/name`,request.data)
}
export function putGroupDescription(request: PutGroupRequestDescription){
    return axiosClient.put(`/Group/${request.id}/description`,request.data)
}
export function putGroupExpirationDate(request: PutGroupRequestExpirationDate){
    return axiosClient.put(`/Group/${request.id}/expirationDate`,request.data)
}

export function postUserInGroup(request: PostUserInGroupRequest){
    return axiosClient.post(`/Group/${request.id}/user/manage`,request.email)
}
export function deleteUserInGroup(request: DeleteUserInGroupRequest){
    return axiosClient.delete(`/Group/${request.id}/user/manage`,{params: {email: request.email}})
}

export function putGroupRoles(request: PutGroupRequestRoles){
    return axiosClient.put(`/Group/${request.id}/roles`,request.data)
}