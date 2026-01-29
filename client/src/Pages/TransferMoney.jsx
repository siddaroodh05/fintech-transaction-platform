import { useState } from "react";
import { CheckCircle, XCircle, Loader2, CreditCard, User } from "lucide-react";
import "../Styles/TransferMoney.css";
import { VERIFYRECIVERACCOUNT } from "../api/transiction";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import { useAccountStore } from "../store/useAccountStore";
export default function TransferMoney() {
  const [accountNumber, setAccountNumber] = useState("");
  const [holderName, setHolderName] = useState("");
  const [amount, setAmount] = useState("");
  const navigate = useNavigate();
 
  const [isVerifying, setIsVerifying] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [verifyError, setVerifyError] = useState("");
  const { isAuthenticated } = useAuthStore();
  const {account} =useAccountStore();

  const [hasVerified, setHasVerified] = useState(false);

  const handleAccountChange = async (e) => {
    let value = e.target.value.replace(/\D/g, "");
    if (value.length > 12) value = value.slice(0, 12);
  
    if (value === accountNumber) return;
  
    setAccountNumber(value);
  
   
    setHolderName("");
    setIsVerified(false);
    setVerifyError("");
    setIsVerifying(false);
    setHasVerified(false);
  
    if (value.length === 12 && isAuthenticated) {
      try {
        setIsVerifying(true);
        const holder = await VERIFYRECIVERACCOUNT(value);
  
       
          setHolderName(holder.holder_name);
          setIsVerified(true);
          setHasVerified(true);
      
      } catch (err) {
      
          setVerifyError("Account not found");
          setIsVerified(false);
          setHasVerified(true);

      } finally {
       setIsVerifying(false);
      }
    }
  };
  const handleAmountChange = (e) => {
    const value = e.target.value;
    if (/^\d*$/.test(value)) {
      setAmount(value);
    }
  };

  const handleTransfer = () => {
    const transferAmount = parseFloat(amount);
    navigate("/verify-pin", {
      state: {
        action: "TRANSFER",amount: transferAmount,from_account:account?.account_number,to_account: accountNumber}});
  

    setAccountNumber("");
    setHolderName("");
    setAmount("");
    setIsVerified(false);
  };

  const canPay =
    accountNumber.length === 12 &&
    isVerified &&
    amount.length > 0;

  return (
    <div className="transfer-container">
      <div className="nav-wrapper">
      </div>

      <div className="transfer-card">
        <h2>Transfer Money</h2>

        {verifyError && (
          <div className="verify-error-banner">{verifyError}</div>
        )}

        <div className="input-box verify-input">
          <input
            id="acc-input"
            type="text"
            inputMode="numeric"
            placeholder=" "
            value={accountNumber}
            onChange={handleAccountChange}
          />

          <label htmlFor="acc-input">
            <CreditCard size={18} /> Account Number
          </label>

          <div className="verify-icon">
            {isVerifying && <Loader2 size={20} className="spin" />}
            {isVerified && <CheckCircle size={20} className="verified" />}
            {verifyError && <XCircle size={20} className="error" />}
          </div>
        </div>

        {holderName && (
          <>
            <div className="input-box">
              <input
                id="holder-input"
                type="text"
                value={holderName}
                readOnly
                placeholder=" "
              />
              <label htmlFor="holder-input">
                <User size={18} /> Account Holder
              </label>
            </div>

            <div className="input-box">
              <input
                id="amount-input"
                type="text"
                inputMode="numeric"
                placeholder=" "
                value={amount}
                onChange={handleAmountChange}
              />
              <label htmlFor="amount-input">₹ Amount</label>
            </div>

            <div className="input-box">
              <input type="text" placeholder=" " />
              <label>Description (optional)</label>
            </div>
          </>
        )}

        <button
          className="pay-button"
          onClick={handleTransfer}
          disabled={!canPay}
        >
          Pay Now
        </button>
      </div>
    </div>
  );
}
