import React, { useContext, useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, FolderOpen, Share2, Settings, 
  LogOut, HardDrive, Image, FileText, Video, History, UserCheck, Shield 
} from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import { FileContext } from '../context/FileContext';

const Sidebar = ({ isOpen, setOpen }) => {
  const { logout } = useContext(AuthContext);
  const { setCategory, category } = useContext(FileContext);

  const navItems = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/' },
    { name: 'Nexus Vault', icon: Shield, path: '/vault' },
    { name: 'Shared With Me', icon: UserCheck, path: '/shared-with-me' },
    { name: 'My Shares', icon: Share2, path: '/shared-list' },
    { name: 'Activity Log', icon: History, path: '/activities' },
    { name: 'Settings', icon: Settings, path: '/settings' },
  ];

  const categories = [
    { name: 'Images', icon: Image, key: 'image' },
    { name: 'Documents', icon: FileText, key: 'text' },
    { name: 'Videos', icon: Video, key: 'video' },
  ];

  return (
    <>
      {isOpen && <div className="modal-overlay" style={{ zIndex: 999 }} onClick={() => setOpen(false)}></div>}
      <div className={`sidebar ${isOpen ? 'open' : ''}`}>

      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2.5rem' }}>
        <div style={{ 
          backgroundColor: 'var(--accent)', 
          padding: '0.5rem', 
          borderRadius: '8px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <HardDrive size={24} color="white" />
        </div>
        <h2 style={{ fontSize: '1.25rem', fontWeight: '700', letterSpacing: '-0.5px' }}>NexusDrive</h2>
      </div>

      <nav style={{ flex: 1, overflowY: 'auto' }}>
        <div style={{ marginBottom: '1.5rem' }}>
          <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.75rem', paddingLeft: '1rem' }}>Menu</p>
          {navItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              style={({ isActive }) => ({
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '0.75rem 1rem',
                color: isActive ? 'var(--text-main)' : 'var(--text-muted)',
                textDecoration: 'none',
                borderRadius: '8px',
                marginBottom: '0.25rem',
                backgroundColor: isActive ? 'var(--bg-hover)' : 'transparent',
                transition: 'all 0.2s'
              })}
              onClick={() => setCategory(null)}
            >
              <item.icon size={20} />
              <span style={{ fontWeight: '500' }}>{item.name}</span>
            </NavLink>
          ))}
        </div>

        <div style={{ marginBottom: '1.5rem' }}>
          <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.75rem', paddingLeft: '1rem' }}>Categories</p>
          {categories.map((item) => (
            <div
              key={item.name}
              onClick={() => setCategory(item.key)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '0.75rem 1rem',
                color: category === item.key ? 'var(--text-main)' : 'var(--text-muted)',
                cursor: 'pointer',
                borderRadius: '8px',
                marginBottom: '0.25rem',
                backgroundColor: category === item.key ? 'var(--bg-hover)' : 'transparent',
                transition: 'all 0.2s'
              }}
            >
              <item.icon size={20} />
              <span style={{ fontWeight: '500' }}>{item.name}</span>
            </div>
          ))}
        </div>
      </nav>

      <button 
        onClick={logout}
        className="btn-outline"
        style={{
          marginTop: 'auto',
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          padding: '0.75rem 1rem',
          border: 'none',
          cursor: 'pointer',
          width: '100%',
          justifyContent: 'flex-start',
          borderRadius: '8px'
        }}
      >
        <LogOut size={20} />
        <span style={{ fontWeight: '500' }}>Logout</span>
      </button>
    </div>
    </>
  );
};

export default Sidebar;
