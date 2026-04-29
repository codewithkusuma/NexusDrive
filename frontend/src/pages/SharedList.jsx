import React, { useContext, useEffect, useState } from 'react';
import { FileContext } from '../context/FileContext';
import FileCard from '../components/FileCard';
import { Share2, Link as LinkIcon } from 'lucide-react';

const SharedList = () => {
  const { files, fetchFilesAndFolders } = useContext(FileContext);
  
  useEffect(() => {
    fetchFilesAndFolders();
  }, [fetchFilesAndFolders]);

  const sharedFiles = files.filter(f => f.shareLink);

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2rem' }}>
        <Share2 size={24} color="var(--accent)" />
        <h1 style={{ fontSize: '1.5rem', fontWeight: '700' }}>Shared Files</h1>
      </div>

      <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>
        Manage all files you have shared via public links.
      </p>

      {sharedFiles.length > 0 ? (
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', 
          gap: '1.5rem' 
        }}>
          {sharedFiles.map(file => (
            <div key={file._id} style={{ position: 'relative' }}>
              <FileCard item={file} isFolder={false} />
              <div style={{
                marginTop: '0.75rem',
                backgroundColor: 'rgba(59, 130, 246, 0.1)',
                padding: '0.5rem 0.75rem',
                borderRadius: '6px',
                fontSize: '0.75rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                border: '1px solid rgba(59, 130, 246, 0.2)',
                color: 'var(--accent)'
              }}>
                <LinkIcon size={12} />
                <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {file.shareLink}
                </span>
              </div>
            </div>
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
          <Share2 size={48} color="var(--text-muted)" style={{ marginBottom: '1rem', opacity: 0.5 }} />
          <h3 style={{ color: 'var(--text-muted)' }}>No shared files yet</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '0.5rem' }}>
            Share a file from your dashboard to see it here.
          </p>
        </div>
      )}
    </div>
  );
};

export default SharedList;
