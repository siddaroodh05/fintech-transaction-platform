import { useState } from "react";
import {
  Mail,
  Lock,
  Rocket,
  User,
  ChevronRight,
  Loader2,
  Briefcase
} from "lucide-react";
import "../styles/Login.css";
import { loginUser, registerUser } from "../api/auth";
import { useNavigate } from "react-router-dom";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async () => {
    setError("");
    setIsLoading(true);

    try {
      if (isLogin) {
        const response = await loginUser(email, password);

        localStorage.setItem("isAuthenticated", "true");
        localStorage.setItem("username", response.username);
        localStorage.setItem("email", response.email);

        navigate("/");
      } else {
        const response = await registerUser(name, email, password);

        localStorage.setItem("isAuthenticated", "true");
        localStorage.setItem("username", response.username);
        localStorage.setItem("email", response.email);

        navigate("/create-bank-account", {
          state: {
            username: response.username,
            email: response.email,
            accountNumber: response.account_number
          }
        });
      }
    } catch (err) {
      let message = "Authentication failed";

      if (err?.response?.data) {
        if (typeof err.response.data === "string") {
          message = err.response.data;
        } else if (typeof err.response.data.detail === "string") {
          message = err.response.data.detail;
        }
      } else if (err?.message) {
        message = err.message;
      }

      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="home-container login-page">
      <nav className="auth-nav">
        <div className="nav-logo">
          <Briefcase size={20} />
          <span className="brand-name">
            Fin<span className="brand-accent">Tech</span>
          </span>
        </div>
      </nav>

      <div className="login-content">
        <div className="login-card-wrapper">
          <div className="hero-preview login-card">
            <div className="login-header">
              <Rocket className="brand-icon" size={32} />
              <h2>
                {isLogin ? "Welcome" : "Create"}{" "}
                <span className="brand-accent">
                  {isLogin ? "Back" : "Account"}
                </span>
              </h2>
              <p className="preview-label">
                {isLogin
                  ? "Enter details to access dashboard"
                  : "Fill in the details to get started"}
              </p>
            </div>

            {error && <div className="error-box">{error}</div>}

            <form
              className="login-form"
              onSubmit={(e) => e.preventDefault()}
            >
              {!isLogin && (
                <div className="input-group">
                  <label>
                    <User size={16} /> Full Name
                  </label>
                  <input
                    type="text"
                    placeholder="Enter your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    disabled={isLoading}
                  />
                </div>
              )}

              <div className="input-group">
                <label>
                  <Mail size={16} /> Email Address
                </label>
                <input
                  type="email"
                  placeholder="name@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading}
                />
              </div>

              <div className="input-group">
                <label>
                  <Lock size={16} /> Password
                </label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                />
              </div>

              <button
                type="button"
                className={`btn-primary login-btn ${
                  isLoading ? "loading" : ""
                }`}
                onClick={handleSubmit}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="spinner" size={18} /> Please wait...
                  </>
                ) : (
                  <>
                    {isLogin ? "Sign In" : "Sign Up"}{" "}
                    <ChevronRight size={18} />
                  </>
                )}
              </button>
            </form>

            <div className="login-footer">
              <p className="preview-label">
                {isLogin
                  ? "Don't have an account?"
                  : "Already have an account?"}
                <span
                  className={`toggle-link ${
                    isLoading ? "disabled" : ""
                  }`}
                  onClick={() => {
                    if (!isLoading) {
                      setIsLogin(!isLogin);
                      setError("");
                    }
                  }}
                >
                  {isLogin ? " Create Account" : " Sign In"}
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
