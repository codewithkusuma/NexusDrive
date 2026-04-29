import React, { useState, useEffect, useContext } from 'react';
import { Shield, Lock, Fingerprint, Eye, EyeOff, Sparkles, CheckCircle } from 'lucide-react';
import { FileContext } from '../context/FileContext';
import FileCard from '../components/FileCard';

const NexusVault = () => {
  const { files, fetchFilesAndFolders } = useContext(FileContext);
  const [isLocked, setIsLocked] = useState(true);
  const [isScanning, setIsScanning] = useState(false);
  const [scanComplete, setScanComplete] = useState(false);

  useEffect(() => {
    if (!isLocked) {
      fetchFilesAndFolders(true); // Fetch vaulted files
    }
  }, [isLocked, fetchFilesAndFolders]);

  const handleScan = () => {
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
      setScanComplete(true);
      setTimeout(() => {
        setIsLocked(false);
      }, 800);
    }, 2000);
  };

  if (!isLocked) {
    return (
      <div style={{ animation: 'fadeIn 0.8s ease-out' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2.5rem' }}>
          <div style={{ padding: '0.75rem', backgroundColor: 'rgba(16, 185, 129, 0.1)', borderRadius: '12px' }}>
            <Shield size={28} color="#10b981" />
          </div>
          <div>
            <h1 style={{ fontSize: '1.8rem', fontWeight: '800', letterSpacing: '-0.5px' }}>Nexus Vault</h1>
            <p style={{ color: '#10b981', fontSize: '0.85rem', fontWeight: '600' }}>Biometric Authentication Verified</p>
          </div>
        </div>

        {files.length > 0 ? (
          <div className="grid-container" style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
            gap: '1.5rem'
          }}>
            {files.map(file => (
              <FileCard key={file._id} item={file} isFolder={false} />
            ))}
          </div>
        ) : (
          <div style={{ 
            textAlign: 'center', 
            padding: '5rem 2rem', 
            backgroundColor: 'rgba(0, 0, 0,0.02)', 
            borderRadius: '24px', 
            border: '1px dashed var(--border-color)',
            maxWidth: '600px',
            margin: '0 auto'
          }}>
            <Lock size={48} color="var(--text-muted)" style={{ marginBottom: '1.5rem', opacity: 0.3 }} />
            <h2 style={{ fontSize: '1.25rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Your Secure Vault is Empty</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Move sensitive files from your dashboard to this vault to hide them from the main view.</p>
          </div>
        )}
      </div>
    );
  }

  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center', 
      height: '70vh',
      textAlign: 'center'
    }}>
      <div style={{ 
        width: '120px', 
        height: '120px', 
        borderRadius: '50%', 
        backgroundColor: 'rgba(168, 85, 247, 0.1)', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        marginBottom: '2rem',
        position: 'relative'
      }}>
        {scanComplete ? <CheckCircle size={60} color="#10b981" /> : <Shield size={60} color="#a855f7" />}
        {isScanning && <div className="scanner-line"></div>}
      </div>

      <h1 style={{ fontSize: '2rem', fontWeight: '800', marginBottom: '0.5rem' }}>Nexus Vault</h1>
      <p style={{ color: 'var(--text-muted)', maxWidth: '400px', marginBottom: '2.5rem' }}>
        This area is protected by military-grade encryption. Please complete biometric verification to proceed.
      </p>

      {!isScanning && !scanComplete && (
        <button 
          onClick={handleScan}
          className="btn" 
          style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '0.75rem', 
            padding: '1rem 2.5rem',
            background: 'linear-gradient(135deg, #a855f7 0%, #7e22ce 100%)',
            border: 'none',
            fontSize: '1rem',
            fontWeight: '700'
          }}
        >
          <Fingerprint size={24} />
          Start Biometric Scan
        </button>
      )}

      {isScanning && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: '#a855f7', fontWeight: '600' }}>
          <Sparkles className="spin" size={20} />
          <span>Scanning Synaptic Identity...</span>
        </div>
      )}

      <style>{`
        .scanner-line {
          position: absolute;
          width: 100%;
          height: 2px;
          background: #a855f7;
          box-shadow: 0 0 15px #a855f7;
          top: 0;
          animation: scan 2s linear infinite;
        }
        @keyframes scan {
          0% { top: 0; }
          50% { top: 100%; }
          100% { top: 0; }
        }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .spin { animation: spin 2s linear infinite; }
        @keyframes fadeIn { from { opacity: 0; transform: scale(0.98); } to { opacity: 1; transform: scale(1); } }
      `}</style>
    </div>
  );
};

export default NexusVault;
