
export const API_BASE_URL ="http://localhost:8000";




export const ENDPOINTS = {
   
    REGISTER: `${API_BASE_URL}/auth/register`,
    LOGIN: `${API_BASE_URL}/auth/login`,
    Logout : `${API_BASE_URL}/auth/logout`,
    Get_ME: `${API_BASE_URL}/auth/me`,
    Create_Account: `${API_BASE_URL}/accounts/create`,
    Get_Account_Details: `${API_BASE_URL}/accounts/me`,
    Check_Balance: `${API_BASE_URL}/accounts/balance`,
    Verify_Reciver_Account: `${API_BASE_URL}/accounts/verify`,
    Transfer_Funds: `${API_BASE_URL}/transactions/transfer`,
    Get_Transaction_Status: `${API_BASE_URL}/transactions/{tx_id}`,
    Get_Transaction_History :`${API_BASE_URL}/transactions/history`

};

