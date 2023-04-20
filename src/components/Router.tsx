import { useContext } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { AuthContext } from "src/contexts/AuthContext";
import { AuthState } from "src/models/auth";
import { routes } from "src/routes";

import "src/styles/app.scss";

function Router() {
  const isLogged = useContext(AuthContext).state === AuthState.Logged;
  return (
    <BrowserRouter>
      <Routes>
        { routes.map((value, index) =>
            <Route path={value.path} element={
              (value.needLogin && isLogged) || !value.needLogin?
                value.element
              : <Navigate
                  to={{
                    pathname: "/login",
                    search: `?redirectTo=${document.location.pathname}`,
                  }}
                />
            } key={index} />
        )}
      </Routes>
    </BrowserRouter>
  );
}

export default Router;
