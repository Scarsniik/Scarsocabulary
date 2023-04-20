export interface Credentials {
    username: string;
    password: string;
}

export interface User {
    username: string;
}

export enum AuthState {
    Unknown = "Unknown",
    Logging = "Logging",
    Logged = "Logged",
    Disconnected = "Disconnected",
}

export interface Auth {
    state: AuthState;
    setAsLogged?: (user: User) => void;
    user?: User
}

export type AuthContextType = Auth;