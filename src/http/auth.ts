import CONFIG from "../config.ts";
import type { LoginPayload, SignupPayload } from "../types/Payloads.ts";
import { auth } from "./index.ts"

export const login = async (payload: LoginPayload) => {
    return await auth.post(CONFIG.auth.login, payload);
}
export const signup = async (payload: SignupPayload) => {
    return await auth.post(CONFIG.auth.signup, payload);
}
export const self = async () => {
    return await auth.get(CONFIG.auth.self);
}
export const logout = async () => {
    return await auth.post(CONFIG.auth.logout);
}