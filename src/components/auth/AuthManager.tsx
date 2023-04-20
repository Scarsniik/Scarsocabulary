import { useEffect, useState } from "react";
import { ApiAuth } from "src/api/auth";
import { AuthContext } from "src/contexts/AuthContext";
import { AuthState, User } from "src/models/auth";

interface Props {
    children: React.ReactNode;
}

export function AuthManager({ children }: Props) {
    const [authState, setAuthState] = useState<AuthState>(AuthState.Unknown);
    const [user, setUser] = useState<User | undefined>();
  
    useEffect(() => {
      async function checkAuth() {
        const result = await ApiAuth.checkLog();
          setAuthState(result.state);
          setUser(result.user);
      }
  
      if (authState === AuthState.Unknown) {
        checkAuth();
      }
    }, [authState]);
  
    const authContextValue = {
      state: authState,
      user: user,
      setAsLogged: (user: User) => {
        setAuthState(AuthState.Logged);
        setUser(user);
      }
    };
  
    return (
      <AuthContext.Provider value={authContextValue}>
        {authState !== AuthState.Unknown && children}
      </AuthContext.Provider>
    );
  }
  