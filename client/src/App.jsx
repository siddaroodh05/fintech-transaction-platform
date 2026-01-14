import './App.css';
import Nav from './components/Nav';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Auth from './Pages/Auth';

function App() {
  return (
    <BrowserRouter>
      
      <Nav />

      <Routes>
        <Route path="/auth" element={<Auth />} />
  
      </Routes>
    </BrowserRouter>
  );
}

export default App;
