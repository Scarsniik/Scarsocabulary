import { useContext } from "react";
import { Link } from "react-router-dom";
import logo from "src/assets/img/logo.svg"
import { AuthContext } from "src/contexts/AuthContext";
import { AuthState } from "src/models/auth";

export default function Header() {
  const auth = useContext(AuthContext);
  return (
    <header id="header">
      <Link className="homeButton" to="/">
        <img src={logo} alt="" className="logo"/>
        Scarsnik
      </Link>
      { auth.state === AuthState.Logged ? <>
        <Link to="/vocabulary">
          Vocabulaire
        </Link>
        <Link to="/kanji">
          Kanji
        </Link>
        <Link to="/training">
          Entrainement
        </Link>
      </> : <>
        <Link to="/login">
          Se connecter
        </Link>
        <Link to="/signup">
          S'enregistrer
        </Link>
      </>}
    </header>
  );
}
