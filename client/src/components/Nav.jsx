import "../Styles/Nav.css";
import {
  ArrowLeftRight,
  Briefcase,
  User,
  Mail,
  LogOut,
  Bell,
  LayoutDashboard
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useState, useRef, useEffect } from "react";

import {  logoutUser } from "../api/auth";
import { GETACCOUNTDETAILS } from "../api/transiction";
import { useAuthStore } from "../store/useAuthStore";
import { useAccountStore } from "../store/useAccountStore";

export default function Nav() {
  const navigate = useNavigate();
  const location = useLocation();
  const isActive = (path) => location.pathname === path;

  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  const { isAuthenticated, user, logout } = useAuthStore();
  const { account, setAccount, clearAccount } = useAccountStore();

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (!isAuthenticated || account) return;

    const fetchAccountData = async () => {
      try {
        const accountDetails = await GETACCOUNTDETAILS();
        setAccount(accountDetails); 
      } catch (err) {
        console.error("Failed to fetch account details", err);
      }
    };

    fetchAccountData();
  }, [isAuthenticated, account, setAccount]);


  const handleLogout = async () => {
    try {
     await logoutUser();  
    } finally {
      logout();          
      clearAccount();  
      sessionStorage.removeItem("transactions");  
      setShowDropdown(false);
      navigate("/auth", { replace: true });
    }
  };


  if (location.pathname === "/auth") return <></>;

  return (
    <nav className="home-navbar">
      <div className="nav-left">
        <div className="brand-wrapper">
          <Briefcase size={20} />
          <span className="brand-name">
            Fin<span className="brand-accent">Tech</span>
          </span>
        </div>
      </div>

      <div className="nav-actions">
        <div className="nav-links">
          <span className={`nav-link ${isActive("/") ? "active" : ""}`} onClick={() => navigate("/")}>
            <LayoutDashboard size={20} />
            <span className="nav-text">Dashboard</span>
          </span>

          <span className={`nav-link ${isActive("/transfer") ? "active" : ""}`} onClick={() => navigate("/transfer")}>
            <ArrowLeftRight size={20} />
            <span className="nav-text">Transfer</span>
          </span>

          <span className={`nav-link ${isActive("/view-account") ? "active" : ""}`} onClick={() => navigate("/view-account")}>
            <User size={16} />
            <span>Account</span>
          </span>

          <span className={`nav-link ${isActive("/notifications") ? "active" : ""}`} onClick={() => navigate("/notifications")}>
            <Bell size={20} />
            <span>Notification</span>
          </span>
        </div>

        {isAuthenticated ? (
          <div className="user-profile-wrapper" ref={dropdownRef}>
            <div className="profile-circle" onClick={() => setShowDropdown(!showDropdown)}>
              <User size={18} />
            </div>

            {showDropdown && (
              <div className="profile-dropdown">
                <div className="dropdown-header">
                  <p className="user-name-text">{user?.name}</p>
                  <p className="user-email-text">
                    <Mail size={12} /> {user?.email}
                  </p>
                </div>

                <div className="dropdown-divider" />

                <button className="logout-button" onClick={handleLogout}>
                  <LogOut size={16} /> Sign Out
                </button>
              </div>
            )}
          </div>
        ) : (
          <button className="btn-outline" onClick={() => navigate("/auth")}>
            Login
          </button>
        )}
      </div>
    </nav>
  );
}
