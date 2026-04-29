import React, { useContext, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { FileContext } from '../context/FileContext';
import { User, Mail, HardDrive, Shield, LogOut, FileText, Image, Video, History } from 'lucide-react';
import { Link } from 'react-router-dom';

const Settings = () => {
  const { user, logout } = useContext(AuthContext);
  const { files, fetchFilesAndFolders, activities, fetchActivities } = useContext(FileContext);

  useEffect(() => {
    fetchFilesAndFolders();
    fetchActivities();
  }, [fetchFilesAndFolders, fetchActivities]);

  const totalSize = files.reduce((acc, file) => acc + (file.size || 0), 0);
  const storageLimit = 5 * 1024 * 1024 * 1024; // 5GB
  const usagePercent = (totalSize / storageLimit) * 100;

  const formatSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getBreakdown = () => {
    const counts = { image: 0, text: 0, video: 0, other: 0 };
    files.forEach(f => {
      if (f.mimeType?.includes('image')) counts.image += f.size;
      else if (f.mimeType?.includes('text') || f.originalName?.endsWith('.pdf')) counts.text += f.size;
      else if (f.mimeType?.includes('video')) counts.video += f.size;
      else counts.other += f.size;
    });
    return counts;
  };

  const breakdown = getBreakdown();

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '1.8rem', fontWeight: '700', marginBottom: '2rem' }}>Settings & Storage</h1>

      <div className="responsive-grid">
        {/* Profile Card */}
        <div style={{ backgroundColor: 'var(--bg-card)', padding: '2rem', borderRadius: '16px', border: '1px solid var(--border-color)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '2rem' }}>
            <div style={{ width: '80px', height: '80px', borderRadius: '50%', backgroundColor: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <User size={40} color="white" />
            </div>
            <div>
              <h2 style={{ fontSize: '1.5rem', fontWeight: '700' }}>{user?.username}</h2>
              <p style={{ color: 'var(--text-muted)' }}>{user?.email}</p>
            </div>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--text-main)' }}>
              <Mail size={18} color="var(--text-muted)" />
              <span style={{ wordBreak: 'break-all' }}>{user?.email}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--text-main)' }}>
              <Shield size={18} color="var(--text-muted)" />
              <span>Two-Factor Authentication: <span style={{color:'var(--danger)', fontSize:'0.8rem'}}>Disabled</span></span>
            </div>
          </div>

          <button onClick={logout} className="btn-outline" style={{ marginTop: '2rem', color: 'var(--danger)', borderColor: 'var(--danger)', display: 'flex', alignItems: 'center', gap: '0.5rem', width: '100%', justifyContent: 'center' }}>
            <LogOut size={18} /> Logout from all devices
          </button>
        </div>

        {/* Storage Card */}
        <div style={{ backgroundColor: 'var(--bg-card)', padding: '2rem', borderRadius: '16px', border: '1px solid var(--border-color)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
            <HardDrive size={24} color="var(--accent)" />
            <h2 style={{ fontSize: '1.25rem', fontWeight: '700' }}>Storage Analysis</h2>
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.9rem' }}>
              <span>{formatSize(totalSize)} of 5 GB used</span>
              <span style={{ fontWeight: '600' }}>{usagePercent.toFixed(1)}%</span>
            </div>
            <div style={{ width: '100%', height: '10px', backgroundColor: 'var(--bg-dark)', borderRadius: '5px', overflow: 'hidden' }}>
              <div style={{ width: `${usagePercent}%`, height: '100%', backgroundColor: 'var(--accent)', transition: 'width 0.5s ease-out' }}></div>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}><Image size={18} color="#10b981" /> <span>Images</span></div>
              <span style={{fontWeight:'600'}}>{formatSize(breakdown.image)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}><FileText size={18} color="#3b82f6" /> <span>Documents</span></div>
              <span style={{fontWeight:'600'}}>{formatSize(breakdown.text)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}><Video size={18} color="#f59e0b" /> <span>Videos</span></div>
              <span style={{fontWeight:'600'}}>{formatSize(breakdown.video)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Activity Summary */}
      <div style={{ marginTop: '2rem', backgroundColor: 'var(--bg-card)', padding: '2rem', borderRadius: '16px', border: '1px solid var(--border-color)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <History size={24} color="var(--accent)" />
            <h2 style={{ fontSize: '1.25rem', fontWeight: '700' }}>Recent Activity</h2>
          </div>
          <Link to="/activities" style={{ color: 'var(--accent)', fontSize: '0.9rem', textDecoration: 'none' }}>View full log</Link>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {activities.slice(0, 5).map(log => (
            <div key={log._id} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem', backgroundColor: 'rgba(0, 0, 0,0.02)', borderRadius: '8px', flexWrap: 'wrap', gap: '0.5rem' }}>
              <span style={{ fontSize: '0.9rem' }}><strong>{log.action}</strong>: {log.targetName}</span>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{new Date(log.timestamp).toLocaleTimeString()}</span>
            </div>
          ))}
          {activities.length === 0 && <p style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '1rem' }}>No recent activities</p>}
        </div>
      </div>
    </div>
  );
};

export default Settings;
