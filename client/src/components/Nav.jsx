import "../Styles/Nav.css";
import { ArrowLeftRight, Briefcase, User } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

export default function Nav() {
  const navigate = useNavigate();
  const location = useLocation(); // Get current route

  if (location.pathname === "/auth") return null;

  return (
    <nav className="home-navbar">
      <div className="nav-left">
        <div className="brand-wrapper" onClick={() => navigate("/")}>
          <Briefcase size={20} />
          <span className="brand-name">
            Fin<span className="brand-accent">Tech</span>
          </span>
        </div>
      </div>

      <div className="nav-actions">
        <div className="nav-links">
          <span className="nav-link" onClick={() => navigate("/transfer")}>
            <ArrowLeftRight size={20} />
            <span className="nav-text">Transfer</span>
          </span>

          <span className="nav-link" onClick={() => navigate("/account")}>
            <User size={20} />
            <span>Account</span>
          </span>
        </div>

        <button className="btn-outline" onClick={() => navigate("/auth")}>
          Login
        </button>
      </div>
    </nav>
  );
}
