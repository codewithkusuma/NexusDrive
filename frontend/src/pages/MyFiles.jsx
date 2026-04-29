import React, { useContext, useEffect, useState } from 'react';
import { FileContext } from '../context/FileContext';
import FileCard from '../components/FileCard';
import { ChevronRight, Home, ArrowLeft } from 'lucide-react';

const MyFiles = () => {
  const { files, folders, currentFolder, setCurrentFolder, fetchFilesAndFolders, searchTerm, category } = useContext(FileContext);
  const [dragActive, setDragActive] = useState(false);
  const { uploadFile } = useContext(FileContext);

  useEffect(() => {
    fetchFilesAndFolders();
  }, [fetchFilesAndFolders]);

  const filteredFolders = folders.filter(f => {
    if (category) return false; // Folders don't show up in specific categories
    const matchesSearch = f.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFolder = currentFolder ? f.parentFolder === currentFolder._id : !f.parentFolder;
    return searchTerm ? matchesSearch : (matchesSearch && matchesFolder);
  });

  const filteredFiles = files.filter(f => {
    const term = searchTerm.toLowerCase();
    
    // Advanced Search Logic
    if (term.includes('type:')) {
      const type = term.split('type:')[1].trim();
      return f.mimeType.toLowerCase().includes(type);
    }
    if (term.includes('size:')) {
      const sizeStr = term.split('size:')[1].trim();
      if (sizeStr.startsWith('>')) {
        const bytes = parseFloat(sizeStr.slice(1)) * 1024 * 1024;
        return f.size > bytes;
      }
      if (sizeStr.startsWith('<')) {
        const bytes = parseFloat(sizeStr.slice(1)) * 1024 * 1024;
        return f.size < bytes;
      }
    }

    const matchesSearch = f.originalName.toLowerCase().includes(term);
    const matchesFolder = currentFolder ? f.folder === currentFolder._id : !f.folder;
    const matchesCategory = category ? f.mimeType.includes(category) : true;
    
    if (searchTerm) return matchesSearch;
    if (category) return matchesCategory;
    return matchesFolder;
  });

  const getPageTitle = () => {
    if (category) return category.charAt(0).toUpperCase() + category.slice(1) + 's';
    if (currentFolder) return currentFolder.name;
    return 'My Files';
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      await uploadFile(e.dataTransfer.files[0], currentFolder?._id);
    }
  };

  return (
    <div 
      onDragEnter={handleDrag} 
      style={{ minHeight: 'calc(100vh - 150px)' }}
    >
      {dragActive && (
        <div 
          onDragEnter={handleDrag} 
          onDragLeave={handleDrag} 
          onDragOver={handleDrag} 
          onDrop={handleDrop}
          style={{
            position: 'fixed',
            top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: 'rgba(59, 130, 246, 0.2)',
            border: '4px dashed var(--accent)',
            zIndex: 2000,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            backdropFilter: 'blur(4px)'
          }}
        >
          <h2 style={{ fontSize: '2rem', color: 'white' }}>Drop files here to upload</h2>
        </div>
      )}

      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '2rem', color: 'var(--text-muted)' }}>
        <Home size={18} cursor="pointer" onClick={() => setCurrentFolder(null)} />
        <ChevronRight size={16} />
        <span style={{ color: currentFolder ? 'var(--text-muted)' : 'var(--text-main)', fontWeight: '500' }}>My Files</span>
        {currentFolder && (
          <>
            <ChevronRight size={16} />
            <span style={{ color: 'var(--text-main)', fontWeight: '500' }}>{currentFolder.name}</span>
          </>
        )}
      </div>

      {currentFolder && (
        <button 
          onClick={() => {
            const parent = folders.find(f => f._id === currentFolder.parentFolder);
            setCurrentFolder(parent || null);
          }}
          className="btn-outline"
          style={{ marginBottom: '1.5rem', border: 'none', padding: '0.5rem 0' }}
        >
          <ArrowLeft size={18} /> Back
        </button>
      )}

      <section style={{ marginBottom: '3rem' }}>
        <h2 style={{ fontSize: '1.1rem', marginBottom: '1.25rem', fontWeight: '600' }}>Folders</h2>
        {filteredFolders.length > 0 ? (
          <div className="grid-container" style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', 
            gap: '1.5rem' 
          }}>
            {filteredFolders.map(folder => (
              <FileCard key={folder._id} item={folder} isFolder={true} />
            ))}
          </div>
        ) : (
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>No folders here.</p>
        )}
      </section>

      <section>
        <h2 style={{ fontSize: '1.1rem', marginBottom: '1.25rem', fontWeight: '600' }}>Files</h2>
        {filteredFiles.length > 0 ? (
          <div className="grid-container" style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', 
            gap: '1.5rem' 
          }}>
            {filteredFiles.map(file => (
              <FileCard key={file._id} item={file} isFolder={false} />
            ))}
          </div>
        ) : (
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>No files uploaded yet.</p>
        )}
      </section>
    </div>
  );
};

export default MyFiles;
