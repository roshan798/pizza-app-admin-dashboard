import type { Roles } from "."

export interface LoginPayload {
    email: string,
    password: string
}
export interface SignupPayload {
    firstName: string,
    lastName: string,
    email: string,
    password: string,
    role: Roles
}
