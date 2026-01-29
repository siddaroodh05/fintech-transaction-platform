import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "../Styles/Success.css";
import { CheckCircle, XCircle } from "lucide-react";
import { CHECKBALANCE } from "../api/transiction";


const BalancePage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const pinStr = location.state?.pinStr;

  const [balanceData, setBalanceData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBalance = async () => {
      try {
        if (!pinStr ) {
          throw new Error("PIN not provided");
        }

        const response = await CHECKBALANCE(pinStr);
        setBalanceData(response);
      } catch (err) {
        setError(
          err?.response?.data?.message || "Invalid PIN. Please try again."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchBalance();
  }, [pinStr]);

  if (error) {
    return (
      <div className="success-page">
        <div className="success-card">
          <div className="success-icon-wrapper error">
            <XCircle size={64} strokeWidth={2.5} />
          </div>

          <h2 className="success-title">Unable to fetch bank balance </h2>
          <p className="error-text">{error}</p>

          <div className="error-actions">
            <button
              className="btn-secondary"
              onClick={() => navigate("/forgot-pin")}
            >
              Forgot PIN?
            </button>

            <button
              className="btn-primary"
              onClick={() => navigate("/")}
            >
              Go to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

if (loading) {
 return (
   <div className="success-page">
     <div className="success-card">
       <div className="loader"></div>

       <h2 className="success-title">Checking Balance</h2>
       <p className="error-text">
         Please wait while we verify your PIN…
       </p>
     </div>
   </div>
 );
}



  return (
    <div className="success-page">
      <div className="success-card">
        <div className="success-icon-wrapper success">
          <CheckCircle size={64} strokeWidth={2.5} />
        </div>

        <h2 className="success-title">
          Account Balance Check Successful
        </h2>

        <div className="details-box">
          <div className="detail-item">
            <span>Account Number</span>
            <strong className="mono-text">{balanceData.account_number}</strong>
          </div>

          <div className="detail-item">
            <span>Available Balance</span>
            <strong>₹ {balanceData.balance.toFixed(2)}</strong>
          </div>
        </div>

        <button className="btn-primary" onClick={() => navigate("/")}>
          Back to Dashboard
        </button>
      </div>
    </div>
  );
};

export default BalancePage;
