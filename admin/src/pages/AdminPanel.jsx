import React from 'react';
import { useAuth } from '../context/AuthContext';
import Dashboard from '../components/Dashboard';
import MenuManagement from '../components/MenuManagement';

const AdminPanel = () => {
  const { user, logout } = useAuth();

  return (
    <div className="admin-panel">
      <h1>Admin Panel</h1>
      {user ? (
        <>
          <button onClick={logout}>Logout</button>
          <Dashboard />
          <MenuManagement />
        </>
      ) : (
        <p>You need to log in to access this page.</p>
      )}
    </div>
  );
};

export default AdminPanel;