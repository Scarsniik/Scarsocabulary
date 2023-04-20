import { createContext } from "react";
import { AuthContextType, AuthState, User } from "src/models/auth";

export const AuthContext = createContext<AuthContextType>({
    state: AuthState.Unknown,
    setAsLogged: (user: User) => {},
});