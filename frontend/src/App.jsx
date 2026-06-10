import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
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

      <Route 
          path="/admin-dashboard" 
          element={
            <ProtectedAdminRoute>
              <AdminDashboard />
            </ProtectedAdminRoute>
          } 
        />

        {/* Fallback redirect if an invalid URL is typed */}
<Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;