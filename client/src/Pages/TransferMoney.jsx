import { useState } from "react";
import "../Styles/TransferMoney.css";
import { CreditCard, User, Lock} from "lucide-react";
import Nav from "../components/Nav";

export default function TransferMoney() {
  const [accountNumber, setAccountNumber] = useState("");
  const [holderName, setHolderName] = useState("");
  const [amount, setAmount] = useState(""); 
  const [pin, setPin] = useState("");

  const handleAccountChange = (e) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 12);
    setAccountNumber(value);
    if (value.length === 12) setHolderName("Amit Kumar");
    else setHolderName("");
  };

  const handleAmountChange = (e) => {
    const value = e.target.value;
  
    if (/^\d*$/.test(value)) {
      setAmount(value);
    }
  };

  const handleTransfer = () => {
  
    const transferAmount = parseFloat(amount);
    alert(`Transferred ₹${transferAmount.toLocaleString()} to ${holderName}`);
    
    // Reset form
    setAccountNumber("");
    setHolderName("");
    setAmount("");
    setPin("");
  };

  const canPay = accountNumber.length === 12 && holderName && amount.length > 0 && pin.length >= 4;

  return (
    <div className="transfer-container">
      <div className="nav-wrapper">
        <Nav />
      </div>

      <div className="transfer-card">
        <h2>Transfer Money</h2>

      
        <div className="input-box">
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
        </div>

       
        {holderName && (
          <>
            <div className="input-box">
              <input id="holder-input" type="text" value={holderName} readOnly placeholder=" " />
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
              <label htmlFor="amount-input">
                <span className="currency-symbol">₹</span> Amount
              </label>
            </div>
            <div className="input-box">
              <input
                id="amount-input"
                type="text"
                inputMode="numeric"
                placeholder=" "
               
              />
              <label htmlFor="amount-input">
                Description[optional]
              </label>
            </div>

            <div className="input-box">
              <input
                id="pin-input"
                type="password"
                inputMode="numeric"
                maxLength={6}
                placeholder=" "
                value={pin}
                onChange={(e) => setPin(e.target.value.replace(/\D/g, ""))}
              />
              <label htmlFor="pin-input">
                <Lock size={18} /> PIN
              </label>
            </div>
          </>
        )}

        <button className="pay-button" onClick={handleTransfer} disabled={!canPay}>
          Pay Now
        </button>
      </div>
    </div>
  );
}