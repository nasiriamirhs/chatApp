declare global {
    namespace NodeJS {
        interface ProcessEnv {
            PORT: number,
            HOST: string,
            JWTSECRET: string
        }
    }
}
export {}