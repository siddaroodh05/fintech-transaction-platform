import axios from "axios";
import { ENDPOINTS } from "./endpoints";

export const CreateAccount = async (username, email, accountNumber, pin) => {
  const response = await axios.post(
    ENDPOINTS.Create_Account, 
    {
      email: email,
      holder_name: username,
      account_number: accountNumber,
      pin: pin
    },
    {
      withCredentials: true  
    }
  );
  return response.data;
};


export const GETACCOUNTDETAILS = async () => {
  const response = await axios.get(ENDPOINTS.Get_Account_Details, {
    withCredentials: true,  
  });

  return response.data;
};

export const CHECKBALANCE = async (pin) => {
  const response = await axios.post(ENDPOINTS.Check_Balance, {pin:pin},{
    withCredentials: true,  
  });
  return response.data;
}



export const VERIFYRECIVERACCOUNT = async (account_number) => {
  const response = await axios.get(ENDPOINTS.Verify_Reciver_Account, {
    params: { account_number: account_number },
    withCredentials: true
  });
  return response.data;
};


export const TRANSFERFUNDS = async (from_account, to_account, amount, pin, idempotencyKey) => {
  const response = await axios.post(
    ENDPOINTS.Transfer_Funds,
    {
      from_account: from_account,
      to_account: to_account,
      amount: amount,
      pin: pin
    },
    {
      headers: { 
        "Idempotency-Key": idempotencyKey 
      },
      withCredentials: true
    }
  );
  return response.data;
};

export const GETTRANSACTIONSTATUS = async (tx_id) => {
  const response = await axios.get(ENDPOINTS.Get_Transaction_Status.replace("{tx_id}", tx_id), {
    withCredentials: true
  });
  return response.data;
}

export const GetTransactionHistory = async (limit = 50, since = null) => {
  const params = { limit };

  if (since) {
    params.since = since; // IST ISO string
  }

  const response = await axios.get(
    ENDPOINTS.Get_Transaction_History,
    {
      params,
      withCredentials: true
    }
  );

  return response.data;
};

