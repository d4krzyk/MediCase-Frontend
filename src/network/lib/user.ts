import { axiosClient } from "../axiosClient"

interface GetUserRequest {
    searchPhrase: string,
    pageNumber: number,
    pageSize: number,
    sortBy: string | null | undefined,
    sortDirection: 0 | 1
}

interface GetUserResponseBad {
    items: UserDataBad[],
    totalPages: number,
    itemsFrom: number,
    itemsTo: number,
    totalItemsCount: number
}

export interface UserDataBad {
    id: number,
    firstName: string,
    lastName: string,
    email: string,
    roles: string[]
}

interface GetUserResponse {
    items: UserData[],
    totalPages: number,
    itemsFrom: number,
    itemsTo: number,
    totalItemsCount: number
}

export interface UserData {
    id: number,
    firstName: string,
    lastName: string,
    email: string,
    isUser: boolean,
    isAdmin: boolean,
    isModerator: boolean
}

interface PostUserRequest {
    firstName: string,
    lastName: string,
    email: string,
    password: string,
}
interface PutUserNameRequest {
    id: number,
    data: PutUserDataName
}
interface PutUserDataName {
    firstName: string,
    lastName: string,
}
interface PutUserRequestPassword{
    id: number,
    data: PutUserDataPassword
}
interface PutUserDataPassword {
    password: string,
}
/*interface GroupDataBad{
    id: number,
    name: string | null,
    description: string | null,
    expirationDate: string | null,
    roles: string[],
    usersCount: number,
}*/

export function getUsers(request: GetUserRequest) {
    return axiosClient.get('/User',
        { params: request }).then(response => correctGetUserResponse(response.data as GetUserResponseBad))
}

export function getUser(id: number) {
    return axiosClient.get(`/User/${id}`).then(response => (response.data))
}

export function postUser(request: PostUserRequest) {
    return axiosClient.post('/User', request)
}

export function putUserName(request: PutUserNameRequest) {
    return axiosClient.put(`/User/${request.id}/name`, request.data)
}
export function putUserPassword(request: PutUserRequestPassword) {
    return axiosClient.put(`/User/${request.id}/password`, request.data)
}


export function deleteUser(id: number) {
    return axiosClient.delete(`/User/${id}`)
}

interface UpdateNameRequest {
    firstName: string,
    lastName: string,
}

export function updateName(request: UpdateNameRequest) {
    return axiosClient.put(`/Account/detalis`, request)
}

interface UpdateEmailRequest {
    email: string,
    password: string
}

export function updateEmail(request: UpdateEmailRequest) {
    return axiosClient.put(`/Account/email`, request)
}

interface UpdatePasswordRequest{
    oldPassword: string,
    newPassword: string
}
export function updatePassword(request: UpdatePasswordRequest){
    return axiosClient.put(`/Account/password`, {...request, confirmPassword: request.newPassword})
}

export function checkModeratorBucketState() {
    return axiosClient.get(`/Moderator/Entity/ModeratorBucket/checkState`).then(response => response.data as boolean)
}

export function synchronizeDatabases() {
    return axiosClient.post(`/Main/EntitySynchronization/syncDatabases`)
}

function correctGetUserResponse(response: GetUserResponseBad): GetUserResponse {
    return {
        ...response,
        items: response.items.map(item => correctUserData(item))
    }
}

export function correctUserData(data: UserDataBad): UserData {
    const user = {
        id: data.id,
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        isUser: data.roles.some(r => r === 'User'),
        isAdmin: data.roles.some(r => r === 'Admin'),
        isModerator: data.roles.some(r => r === 'Moderator'),
    };
    return user;
}