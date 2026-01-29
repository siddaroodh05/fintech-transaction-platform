import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Nav from './components/Nav';
import Auth from './Pages/Auth';
import Dashbord from './Pages/Dashbord';
import CreateBankAccount from "./Pages/CreateBankAccount";
import AccountView from './Pages/AccountView';
import TransferMoney from './Pages/TransferMoney';
import SetupSuccess from './Pages/Success';
import BalancePage from './Pages/BalancePage';
import PinEntryPage from './components/PinEntryPage';
import TransferStatus from './Pages/TransferStatus';
import { useAuthStore } from './store/useAuthStore';
import { useEffect } from 'react';
function App() {
  const hydrate = useAuthStore((state) => state.hydrate);

  useEffect(() => {
    hydrate(); 
  }, []);

 

  return (

    
    <BrowserRouter>
      <Nav />
      <Routes>
        <Route path="/" element={<Dashbord />} />
        <Route path="/create-bank-account" element={<CreateBankAccount />} />
        <Route path="/setup-success" element={<SetupSuccess />} />
                                  
        <Route path="/auth" element={<Auth />} />
        <Route path="/view-account" element={<AccountView />} />
        <Route path="/verify-pin" element={<PinEntryPage />} />
        <Route path="/balance" element={<BalancePage />} />
        <Route path="/transfer-status" element={<TransferStatus/>}/>
        <Route path="/transfer" element={<TransferMoney />} />
  
      </Routes>
    </BrowserRouter>
  );
}

export default App;
