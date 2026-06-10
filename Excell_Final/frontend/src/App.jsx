import { BrowserRouter, Routes, Route } from 'react-router-dom';
import UserView from './components/UserView';
import AdminDashboard from './components/AdminDashboard';
import AdminLogin from './components/AdminLogin';
import ProtectedAdminRoute from './components/ProtectedAdminRoute';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<UserView />} />

        {/* Admin Login */}
        <Route path="/admin-login" element={<AdminLogin />} />

        {/* Protected Admin Dashboard */}
        <Route
          path="/admin"
          element={
            <ProtectedAdminRoute>
              <AdminDashboard />
            </ProtectedAdminRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;