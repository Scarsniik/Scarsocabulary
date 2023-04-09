import { Link } from "react-router-dom";
import logo from "src/assets/img/logo.svg"

export default function Header() {
  return (
    <header id="header">
      <Link className="homeButton" to="/">
        <img src={logo} alt="" className="logo"/>
        Scarsnik
      </Link>
      <Link to="/vocabulary">
        Vocabulaire
      </Link>
    </header>
  );
}
