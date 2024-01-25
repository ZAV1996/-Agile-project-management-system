export type Tokens = {
    access_token: string,
    refresh_token: string
}
export interface CreateTokenData extends Email {
    PER_NUM: string,
    UUID: string,
    IP: string,
    USER_AGENT: string
}

export interface Email {
    EMAIL: string
}