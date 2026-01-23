import { User, Mail, CreditCard } from "lucide-react";
import "../Styles/AccountView.css";
import Nav from "../components/Nav";
import { useUserStore } from "../store/useUserStore";

export default function AccountView() {
  const { user, setUser, balance } = useUserStore();

  return (
    <div className="account-page">
      <div className="nav-wrapper">
        <Nav />
      </div>

      <div className="account-card">
        <div className="profile-section">
          <div className="profile-icon">
            <User size={40} />
          </div>
          <h2 className="user-name">{user?.holder_name || "Loading..."}</h2>
        </div>

        <div className="details-section">
          <div className="detail-row">
            <CreditCard size={18} />
            <span>
              <strong>Account No:</strong>{" "}
              {user?.account_number || "-----------"}
            </span>
          </div>

          <div className="detail-row">
            <Mail size={18} />
            <span>
              <strong>Email:</strong> {user?.email || "-----------"}
            </span>
          </div>
        </div>

        <div className="action-section">
          <button className="btn primary">Manage PIN</button>

          <button className="btn secondary">
            {balance !== null ? `Balance: ₹${balance}` : "Check Balance"}
          </button>
        </div>
      </div>
    </div>
  );
}
