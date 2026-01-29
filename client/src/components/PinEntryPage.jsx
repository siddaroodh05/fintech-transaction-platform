import { useRef, useState } from "react";
import "../Styles/PinEntry.css";
import { useNavigate,useLocation } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";

const PinEntryPage = () => {
  const inputsRef = useRef([]);
  const navigate = useNavigate();
  const location = useLocation();
  const { action = "CHECK_BALANCE", amount, from_account, to_account } =
  location.state || {};
  const [pin, setPin] = useState(["", "", "", ""]);
  const [message, setMessage] = useState("");
  const { isAuthenticated } = useAuthStore();

  const handleChange = (e, index) => {
    const value = e.target.value;
    if (!/^\d?$/.test(value)) return;

    const newPin = [...pin];
    newPin[index] = value;
    setPin(newPin);

    if (value && index < 3) {
      inputsRef.current[index + 1].focus();
    }

    setMessage("");
  };

  const handleSubmitPin = () => {
    const pinStr = pin.join("");
    if (!isAuthenticated) {
      setMessage("You are not authenticated. Please login.");
      return; // stop further processing
    }
  
  
    if (pinStr.length !== 4) {
      setMessage("Please enter all 4 digits of your PIN.");
      return;
    }
  
    setMessage("");
  
    if (action === "CHECK_BALANCE"   ) {
      navigate("/balance", {
        state: { pinStr },
        replace: true
      });
    } else if (action === "TRANSFER") {
      const uniqueKey = crypto.randomUUID();
      navigate("/transfer-status", {
        state: {
          pinStr,
          from_account,
          to_account,
          amount,
          uniqueKey
        },
        replace: true
      });
    }
  };
  
  

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace") {
      if (pin[index]) {
        const newPin = [...pin];
        newPin[index] = "";
        setPin(newPin);
      } else if (index > 0) {
        inputsRef.current[index - 1].focus();
      }
    }

    if (e.key === "ArrowLeft" && index > 0) {
      inputsRef.current[index - 1].focus();
    }

    if (e.key === "ArrowRight" && index < 3) {
      inputsRef.current[index + 1].focus();
    }
  };

  return (
    <div className="pin-page">
      <div className="pin-card">
        <h2 className="pin-title">Enter 4-Digit PIN</h2>
        <p className="pin-subtitle">
          For security, please confirm your PIN
        </p>

        <div className="pin-input-group">
          {pin.map((_, index) => (
            <input
              key={index}
              type="password"
              maxLength="1"
              className="pin-input"
              ref={(el) => (inputsRef.current[index] = el)}
              onChange={(e) => handleChange(e, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
            />
          ))}
        </div>

        {message && <p className="pin-message">{message}</p>}

        <button className="btn-primary" onClick={handleSubmitPin}>
  {action === "CHECK_BALANCE" ? "Check Balance" : "Confirm Transfer"}
</button>

      </div>
    </div>
  );
};

export default PinEntryPage;
