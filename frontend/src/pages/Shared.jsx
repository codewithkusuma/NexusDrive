import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { File, Download, HardDrive } from 'lucide-react';

const Shared = () => {
  const { link } = useParams();
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSharedFile = async () => {
      try {
        const res = await axios.get(`/api/files/shared-info/${link}`);
        setFile(res.data);
      } catch (err) {
        setError("File not found or link has expired.");
      } finally {
        setLoading(false);
      }
    };
    fetchSharedFile();
  }, [link]);

  const handleDownload = () => {
    window.open(`/api/files/shared/${link}`, '_blank');
  };

  const formatSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  if (loading) return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', color: 'white' }}>Loading shared file...</div>;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', backgroundColor: 'var(--bg-dark)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '3rem' }}>
        <HardDrive size={32} color="var(--accent)" />
        <h1 style={{ fontSize: '1.75rem', color: 'white' }}>NexusDrive</h1>
      </div>

      <div className="modal-content" style={{ width: '100%', maxWidth: '500px', textAlign: 'center', padding: '3rem' }}>
        {error ? (
          <p style={{ color: 'var(--danger)' }}>{error}</p>
        ) : (
          <>
            <div style={{ color: 'var(--accent)', marginBottom: '1.5rem', display: 'flex', justifyContent: 'center' }}>
              <File size={64} />
            </div>
            <h2 style={{ marginBottom: '0.5rem', wordBreak: 'break-all' }}>{file.originalName}</h2>
            <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>
              Shared by {file.sharedBy} • {formatSize(file.size)}
            </p>
            
            <button className="btn" onClick={handleDownload} style={{ width: '100%', justifyContent: 'center', padding: '1rem' }}>
              <Download size={20} /> Download File
            </button>
          </>
        )}
      </div>
      
      <p style={{ marginTop: '2rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
        NexusDrive • Secure Cloud Storage Demo
      </p>
    </div>
  );
};

export default Shared;
