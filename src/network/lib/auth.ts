import { axiosClient } from "../axiosClient";
import { UserDataBad, correctUserData } from "./user";

interface RegisterRequest{
    firstName: string,
    lastName: string,
    email: string,
    password: string
}

interface LoginRequest{
    email: string,
    password: string,
}

export function register(data: RegisterRequest){
    return axiosClient.post(
        '/Account/register',
        data,
    )
}

export function login(credentials: LoginRequest){
    return axiosClient.post(
        '/Account/login',
        credentials,
    ).then(response => response.data as string)
}

export function logout(){
    return axiosClient.delete(
        '/Account/logout'
    )
}

export function introspect(){
    return axiosClient.get('Account/introspect').then(response => correctUserData(response.data as UserDataBad))
}