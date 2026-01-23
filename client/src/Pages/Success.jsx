import { useLocation, useNavigate } from "react-router-dom";
import { CheckCircle2, ArrowRight } from "lucide-react";
import "../Styles/Success.css"; 

 const SetupSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const data = location.state;

  if (!data) return navigate("/"); 

  return (
    <div className="home-container success-page">
      <div className="login-card success-card">
        <div className="success-icon-wrapper">
          <CheckCircle2 size={80} color="#22c55e" />
        </div>
        
        <h2 className="success-title">Registration Successful!</h2>
        <p className="preview-label">Your digital bank account is now active.</p>

        <div className="details-box">
          <div className="detail-item">
            <span>Account Holder</span>
            <strong>{data.name}</strong>
          </div>
          <div className="detail-item">
            <span>Account Number</span>
            <strong className="mono-text">{data.accountNumber}</strong>
          </div>
          <div className="detail-item">
            <span>Linked Email</span>
            <strong>{data.email}</strong>
          </div>
        </div>

        <button className="btn-primary login-btn" onClick={() => navigate("/")}>
          Go to Dashboard <ArrowRight size={18} />
        </button>
      </div>
    </div>
  );
};

export default SetupSuccess;