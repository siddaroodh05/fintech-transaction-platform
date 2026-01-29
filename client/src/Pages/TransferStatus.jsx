import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { CheckCircle, XCircle } from "lucide-react";
import { TRANSFERFUNDS, GETTRANSACTIONSTATUS } from "../api/transiction";
import "../Styles/TransferStatus.css";
import formatFullDate from "../utills/formatfulldate";

const TransferStatus = () => {
  

  const location = useLocation();
  const navigate = useNavigate();
  const hasRunRef = useRef(false);

  const state = location.state || {};
  const { pinStr, from_account, to_account, amount, uniqueKey } = state;

  const [txId, setTxId] = useState(null);
  const [status, setStatus] = useState("loading"); 
  const [data, setData] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!location.state) {
      navigate("/", { replace: true });
      return;
    }

    if (hasRunRef.current) return;
    hasRunRef.current = true;

    const processTransfer = async () => {
      try {
        const transferRes = await TRANSFERFUNDS(
          from_account,
          to_account,
          amount,
          pinStr,
          uniqueKey
        );
        
        
        setData(transferRes);
        setTxId(transferRes.transaction_id);

        const statusRes = await GETTRANSACTIONSTATUS(
          transferRes.transaction_id
        );
        
        if (statusRes.status === "SUCCESS") {
          setStatus("success");
          setData(statusRes);
        } else {
          setStatus("failed");
          setData(statusRes);
        }
        window.history.replaceState({}, document.title);
      } catch (err) {
        setStatus("failed");
        window.history.replaceState({}, document.title);
        if (err.response) {
          
          setData(err.response.data.detail || null);
          
          setError(err.response.data?.detail?.message || "Transaction failed");
        } else {
          setError("Server unreachable. Please try again.");
        }
      }
    };

    if (from_account && to_account && amount && pinStr) {
      processTransfer();
    } else {
      navigate("/", { replace: true });
    }
  }, [from_account, to_account, amount, pinStr, navigate, location.state, uniqueKey]);

  return (
    <div className="transfer-status-page">
      <div className="transfer-status-card">
        {status === "loading" && (
          <>
            <div className="transfer-status-loader"></div>
            <h2 className="transfer-status-title">Processing Payment</h2>
            <p className="transfer-status-subtitle">
              Please wait while we confirm your transaction
            </p>
          </>
        )}

        {status === "success" && data && (
          <>
            <div className="transfer-status-icon-wrapper">
              <CheckCircle size={56} />
            </div>

            <h2 className="transfer-status-title">Payment Successful</h2>
            <p className="transfer-status-subtitle">
              {formatFullDate(data.settled_at) || "Transaction Completed"}
            </p>

            <div className="transfer-status-details-box">
              <div className="transfer-status-detail-item">
                <span>Paid To</span>
                <strong>{data.receiver_name}</strong>
              </div>
              <div className="transfer-status-detail-item">
                <span>Transaction ID</span>
                <strong className="transfer-status-mono">{data.transaction_id || txId}</strong>
              </div>
              <div className="transfer-status-detail-item">
                <span>Payment</span>
                <strong>₹ {data.amount || amount}</strong>
              </div>
              <div className="transfer-status-detail-item">
                <span>Account Number</span>
                <strong className="transfer-status-mono">{data.to_account || "—"}</strong>
              </div>
            </div>

            <button 
              className="transfer-status-btn-primary" 
              onClick={() => navigate("/")}
            >
              Done
            </button>
          </>
        )}

        {status === "failed" && (
          <>
            <div className="transfer-status-icon-wrapper error">
              <XCircle size={56} />
            </div>

            <h2 className="transfer-status-title">Payment Failed</h2>
            <p className="transfer-status-subtitle">
              {formatFullDate(data.created_at) || "Transaction Completed"}
            </p>

            <div className="transfer-status-details-box">
              <div className="transfer-status-detail-item">
                <span>Payment To</span>
                <strong>{data?.receiver_name || "—"}</strong>
              </div>

              <div className="transfer-status-detail-item">
                <span>Transaction ID</span>
                <strong className="transfer-status-mono">{data?.reference_id || txId || "N/A"}</strong>
              </div>
              <div className="transfer-status-detail-item">
                <span>Account Number</span>
                <strong className="transfer-status-mono">{data.to_account || "—"}</strong>
              </div>
              <div className="transfer-status-detail-item">
                <span>Message</span>
                <strong style={{ color: "#ef4444" }}>{data?.message || error}</strong>
              </div>
            </div>

            <div className="transfer-status-actions" style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '20px' }}>
              <button 
                className="transfer-status-btn-primary" 
                onClick={() => navigate(-1)}
              >
                Re-enter PIN
              </button>
              <button 
                className="transfer-status-btn-secondary" 
                style={{
                  background: 'transparent',
                  color: '#94a3b8',
                  border: '1px solid #334155',
                  padding: '12px',
                  borderRadius: '12px',
                  cursor: 'pointer',
                  fontWeight: '600'
                }}
                onClick={() => navigate("/")}
              >
                Forgot PIN?
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default TransferStatus;