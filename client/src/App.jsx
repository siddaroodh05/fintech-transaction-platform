import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Auth from './Pages/Auth';
import Dashbord from './Pages/Dashbord';
import CreateBankAccount from "./Pages/CreateBankAccount";
import AccountView from './Pages/AccountView';
import TransferMoney from './Pages/TransferMoney';
import SetupSuccess from './Pages/Success';
function App() {

 

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashbord />} />
        <Route path="/create-bank-account" element={<CreateBankAccount />} />
        <Route path="/setup-success" element={<SetupSuccess />} />
                                  
        <Route path="/auth" element={<Auth />} />
        <Route path="/view-account" element={<AccountView />} />
        <Route path="/transfer" element={<TransferMoney />} />
  
      </Routes>
    </BrowserRouter>
  );
}

export default App;
