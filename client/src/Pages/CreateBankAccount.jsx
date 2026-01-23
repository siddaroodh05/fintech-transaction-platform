import { useState } from "react";
import {
  User,
  Mail,
  CreditCard,
  Lock,
  ChevronRight,
  Loader2
} from "lucide-react";
import "../styles/Login.css";
import { useLocation, useNavigate } from "react-router-dom";
import { CreateAccount } from "../api/transiction";

const CreateBankAccount = () => {
  const location = useLocation();
  const userData = location.state;
  const navigate = useNavigate();

  const [pin, setPin] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    if (pin.length !== 4) {
      setError("Transaction PIN must be exactly 4 digits");
      return;
    }

    setError("");
    setIsLoading(true);

    try {
      await CreateAccount(
        userData.username,
        userData.email,
        userData.accountNumber,
        pin
      );

      navigate("/setup-success", {
        state: {
          name: userData.username,
          accountNumber: userData.accountNumber,
          email: userData.email
        }
      });
    } catch (err) {
      const msg =
        err.response?.data?.detail ||
        "Failed to create account. Please try again.";
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="home-container login-page">
      <div className="login-content">
        <div className="login-card-wrapper">
          <div className="hero-preview login-card">
            <div className="login-header">
              <CreditCard size={32} className="brand-icon" />
              <h2>
                Create <span className="brand-accent">Bank Account</span>
              </h2>
              <p className="preview-label">
                Set up your bank account to start transactions
              </p>
            </div>

            {error && <div className="error-box">{error}</div>}

            <div className="login-form">
              <div className="input-group">
                <label>
                  <User size={16} /> Username
                </label>
                <input
                  value={userData?.username || ""}
                  disabled
                  className="disabled-input"
                />
              </div>

              <div className="input-group">
                <label>
                  <Mail size={16} /> Email Address
                </label>
                <input
                  value={userData?.email || ""}
                  disabled
                  className="disabled-input"
                />
              </div>

              <div className="input-group">
                <label>
                  <CreditCard size={16} /> Account Number
                </label>
                <input
                  value={userData?.accountNumber || ""}
                  disabled
                  className="disabled-input"
                />
              </div>

              <div className="input-group">
                <label>
                  <Lock size={16} /> Set Transaction PIN
                </label>
                <input
                  type="password"
                  inputMode="numeric"
                  placeholder="Enter 4-digit PIN"
                  maxLength={4}
                  value={pin}
                  onChange={(e) =>
                    setPin(e.target.value.replace(/\D/g, ""))
                  }
                  disabled={isLoading}
                />
              </div>

              <button
                className={`btn-primary login-btn ${
                  isLoading ? "loading" : ""
                }`}
                onClick={handleSubmit}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="spinner" size={18} /> Processing...
                  </>
                ) : (
                  <>
                    Complete Setup <ChevronRight size={18} />
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateBankAccount;
