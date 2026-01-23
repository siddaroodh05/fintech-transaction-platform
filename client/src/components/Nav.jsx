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
import { GETACCOUNTDETAILS } from "../api/transiction.js";
import { useUserStore } from "../store/useUserStore";
import { logoutUser } from "../api/auth.js";

export default function Nav() {
  const navigate = useNavigate();
  const location = useLocation();
  const isActive = (path) => location.pathname === path;
  
 
  const { user: storeUser, setUser } = useUserStore();

  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (location.pathname === "/auth") return null;

  // 2. Keep your local logic exactly as you had it
  const isLoggedIn = !!localStorage.getItem("isAuthenticated");
  const localUser = {
    username: localStorage.getItem("username"),
    email: localStorage.getItem("email")
  };

  const handleLogout = async () => {
    await logoutUser();
    localStorage.clear();
    sessionStorage.clear();
    setShowDropdown(false);
    navigate("/auth"); 
  };

  
  useEffect(() => {
    const fetchAccountData = async () => {
      try {
        // Only fetch if we don't already have the data in store
        if (!storeUser && isLoggedIn) {
          const response = await GETACCOUNTDETAILS();
          console.log(response);
          
          setUser(response); 
        }
      } catch (error) {
        console.error("Failed to fetch account details:", error);
      }
    };

    fetchAccountData();
  }, [storeUser, setUser, isLoggedIn]);

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

        {isLoggedIn ? (
          <div className="user-profile-wrapper" ref={dropdownRef}>
            <div className="profile-circle" onClick={() => setShowDropdown(!showDropdown)}>
              <User size={18} />
            </div>

            {showDropdown && (
              <div className="profile-dropdown">
                <div className="dropdown-header">
                  <p className="user-name-text">{localUser.username}</p>
                  <p className="user-email-text">
                    <Mail size={12} /> {localUser.email}
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