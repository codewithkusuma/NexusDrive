import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthContext } from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import DashboardLayout from './components/DashboardLayout';
import MyFiles from './pages/MyFiles';
import Shared from './pages/Shared';
import SharedList from './pages/SharedList';
import SharedWithMe from './pages/SharedWithMe';
import Activities from './pages/Activities';
import Settings from './pages/Settings';
import NexusVault from './pages/NexusVault';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);
  if (loading) return <div style={{display:'flex', justifyContent:'center', marginTop:'5rem', color:'white'}}>Loading...</div>;
  if (!user) return <Navigate to="/login" />;
  return children;
};

function App() {
  React.useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      document.body.classList.add('dark-theme');
      if (!savedTheme) localStorage.setItem('theme', 'dark');
    }
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/shared/:link" element={<Shared />} />
        
        <Route path="/" element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }>
          <Route index element={<MyFiles />} />
          <Route path="shared-with-me" element={<SharedWithMe />} />
          <Route path="shared-list" element={<SharedList />} />
          <Route path="activities" element={<Activities />} />
          <Route path="settings" element={<Settings />} />
          <Route path="vault" element={<NexusVault />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
