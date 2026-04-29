import React, { useContext, useEffect } from 'react';
import { FileContext } from '../context/FileContext';
import FileCard from '../components/FileCard';
import { UserCheck } from 'lucide-react';

const SharedWithMe = () => {
  const { sharedWithMe, fetchFilesAndFolders } = useContext(FileContext);

  useEffect(() => {
    fetchFilesAndFolders();
  }, [fetchFilesAndFolders]);

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2rem' }}>
        <UserCheck size={24} color="var(--accent)" />
        <h1 style={{ fontSize: '1.5rem', fontWeight: '700' }}>Shared With Me</h1>
      </div>

      {sharedWithMe.length > 0 ? (
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', 
          gap: '1.5rem' 
        }}>
          {sharedWithMe.map(file => (
            <FileCard key={file._id} item={file} isFolder={false} />
          ))}
        </div>
      ) : (
        <div style={{ 
          textAlign: 'center', 
          padding: '4rem 2rem', 
          backgroundColor: 'var(--bg-card)', 
          borderRadius: '12px',
          border: '1px dashed var(--border-color)'
        }}>
          <UserCheck size={48} color="var(--text-muted)" style={{ marginBottom: '1rem', opacity: 0.5 }} />
          <h3 style={{ color: 'var(--text-muted)' }}>No files shared with you</h3>
        </div>
      )}
    </div>
  );
};

export default SharedWithMe;
