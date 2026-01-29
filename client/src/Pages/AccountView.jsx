import { User, Mail, CreditCard } from "lucide-react";
import "../Styles/AccountView.css";
import { useAccountStore } from "../store/useAccountStore";

export default function AccountView() {
  const { account } = useAccountStore();


  return (
    <div className="account-page">
      <div className="nav-wrapper">
      </div>

      <div className="account-card">
        <div className="profile-section">
          <div className="profile-icon">
            <User size={40} />
          </div>
          <h2 className="user-name">{account?.holder_name || "Loading..."}</h2>
        </div>

        <div className="details-section">
          <div className="detail-row">
            <CreditCard size={18} />
            <span>
              <strong>Account No:</strong>{" "}
              {account?.account_number || "-----------"}
            </span>
          </div>

          <div className="detail-row">
            <Mail size={18} />
            <span>
              <strong>Email:</strong> {account?.email || "-----------"}
            </span>
          </div>
        </div>

        <div className="action-section">
          <button className="btn primary">Manage PIN</button>

          <button className="btn secondary">Check Balance
          </button>
        </div>
      </div>
    </div>
  );
}
