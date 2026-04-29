import React, { useContext, useState, useEffect } from 'react';
import { Search, Bell, User, Plus, FolderPlus, Upload, LogOut, Settings, Moon, Sun, Menu } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import { FileContext } from '../context/FileContext';
import { useNavigate } from 'react-router-dom';

const Topbar = ({ setSidebarOpen }) => {
  const navigate = useNavigate();
  const { user, logout } = useContext(AuthContext);
  const { createFolder, uploadFile, currentFolder, searchTerm, setSearchTerm } = useContext(FileContext);
  const [showNewFolderModal, setShowNewFolderModal] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    // Check saved theme or preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      setIsDarkMode(true);
      document.body.classList.add('dark-theme');
    }
  }, []);

  const toggleTheme = () => {
    if (isDarkMode) {
      document.body.classList.remove('dark-theme');
      localStorage.setItem('theme', 'light');
      setIsDarkMode(false);
    } else {
      document.body.classList.add('dark-theme');
      localStorage.setItem('theme', 'dark');
      setIsDarkMode(true);
    }
  };

  const handleCreateFolder = async (e) => {
    e.preventDefault();
    if (newFolderName.trim()) {
      await createFolder(newFolderName, currentFolder?._id);
      setNewFolderName('');
      setShowNewFolderModal(false);
    }
  };

  const handleUploadClick = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.onchange = async (e) => {
      const file = e.target.files[0];
      if (file) {
        await uploadFile(file, currentFolder?._id);
      }
    };
    input.click();
  };

  return (
    <div style={{
      height: '70px',
      borderBottom: '1px solid var(--border-color)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 1rem',
      backgroundColor: 'var(--bg-dark)',
      position: 'relative',
      zIndex: 100
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flex: 1 }}>
        <button 
          onClick={() => setSidebarOpen(true)}
          className="btn-outline" 
          style={{ border: 'none', padding: '0.5rem', display: window.innerWidth <= 768 ? 'flex' : 'none' }}
        >
          <Menu size={24} />
        </button>

        <div style={{ position: 'relative', width: '100%', maxWidth: '400px' }}>
          <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input 
            type="text" 
            placeholder="Search..." 
            className="input-field" 
            style={{ paddingLeft: '40px', backgroundColor: 'var(--bg-card)' }}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button className="btn btn-outline" onClick={() => setShowNewFolderModal(true)} style={{ padding: '0.5rem' }}>
            <FolderPlus size={18} />
            <span className="mobile-hide">New Folder</span>
          </button>
          <button className="btn" onClick={handleUploadClick} style={{ padding: '0.5rem' }}>
            <Upload size={18} />
            <span className="mobile-hide">Upload</span>
          </button>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', borderLeft: '1px solid var(--border-color)', paddingLeft: '0.75rem', position: 'relative' }}>
          <div style={{ textAlign: 'right' }} className="mobile-hide">
            <p style={{ fontSize: '0.9rem', fontWeight: '600' }}>{user?.username}</p>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Free Plan</p>
          </div>
          <div 
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            style={{ 
            width: '36px', 
            height: '36px', 
            borderRadius: '50%', 
            backgroundColor: 'var(--accent)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer'
          }}>
            <User size={20} color="white" />
          </div>
          
          {showProfileMenu && (
            <div style={{
              position: 'absolute',
              top: '50px',
              right: '0',
              backgroundColor: 'var(--bg-card)',
              border: '1px solid var(--border-color)',
              borderRadius: '8px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
              padding: '0.5rem',
              width: '200px',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.25rem',
              zIndex: 1000
            }}>
              <div style={{ padding: '0.5rem', borderBottom: '1px solid var(--border-color)', marginBottom: '0.25rem' }}>
                <p style={{ fontWeight: '600', fontSize: '0.9rem' }}>{user?.username}</p>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>{user?.email}</p>
              </div>
              
              <button className="btn-outline" onClick={toggleTheme} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem', border: 'none', width: '100%', textAlign: 'left', cursor: 'pointer', borderRadius: '4px' }}>
                {isDarkMode ? <Sun size={16} /> : <Moon size={16} />}
                <span>{isDarkMode ? 'Light Mode' : 'Dark Mode'}</span>
              </button>
              
              <button className="btn-outline" onClick={() => navigate('/settings')} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem', border: 'none', width: '100%', textAlign: 'left', cursor: 'pointer', borderRadius: '4px' }}>
                <Settings size={16} />
                <span>Account Settings</span>
              </button>
              
              <button className="btn-outline" onClick={logout} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem', border: 'none', width: '100%', textAlign: 'left', cursor: 'pointer', borderRadius: '4px', color: 'var(--danger)' }}>
                <LogOut size={16} />
                <span>Logout</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {showNewFolderModal && (
        <div className="modal-overlay" style={{ zIndex: 10000 }}>
          <div className="modal-content">
            <h2 style={{ marginBottom: '1.5rem', fontSize: '1.25rem' }}>Create New Folder</h2>
            <form onSubmit={handleCreateFolder}>
              <input 
                type="text" 
                className="input-field" 
                placeholder="Folder name" 
                autoFocus
                value={newFolderName}
                onChange={(e) => setNewFolderName(e.target.value)}
                style={{ marginBottom: '1.5rem' }}
              />
              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                <button type="button" className="btn btn-outline" onClick={() => setShowNewFolderModal(false)}>Cancel</button>
                <button type="submit" className="btn">Create Folder</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Topbar;
