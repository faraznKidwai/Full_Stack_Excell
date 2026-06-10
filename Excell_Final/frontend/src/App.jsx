import { BrowserRouter, Routes, Route } from 'react-router-dom';
import UserView from './components/UserView';
import AdminDashboard from './components/AdminDashboard';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<UserView />} />
        <Route path="/Admin_Saifzam" element={<AdminDashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
