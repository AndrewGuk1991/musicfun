

export type MeResponse = {
    userId: string
    login: string
}

export type LoginResponse = {
    refreshToken: string
    accessToken: string
}

export type LoginArgs = {
    code: string
    redirectUri: string
    accessToken?: string
    rememberMe: boolean
}