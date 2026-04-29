import React, { useState, useContext } from 'react';
import { File, Folder, MoreVertical, ExternalLink, Trash2, Edit2, Share2, Copy, Check, Brain, Sparkles, Tag, Shield, Eye, LogOut, Video } from 'lucide-react';
import { FileContext } from '../context/FileContext';

const FileCard = ({ item, isFolder }) => {
  const { deleteFile, deleteFolder, renameFile, renameFolder, getShareLink, shareWithUser, setCurrentFolder, getFileContent, updateFileContent, analyzeFile, toggleVault } = useContext(FileContext);
  const [showMenu, setShowMenu] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showRenameModal, setShowRenameModal] = useState(false);
  const [newName, setNewName] = useState(isFolder ? item.name : item.originalName);
  
  const [showEditModal, setShowEditModal] = useState(false);
  const [editContent, setEditContent] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const [showShareModal, setShowShareModal] = useState(false);
  const [shareTab, setShareTab] = useState('link'); // 'link' or 'user'
  const [sharePassword, setSharePassword] = useState('');
  const [shareExpiry, setShareExpiry] = useState('');
  const [shareEmail, setShareEmail] = useState('');

  const [showAIModal, setShowAIModal] = useState(false);
  const [aiInsights, setAIInsights] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleVaultToggle = (e) => {
    e.stopPropagation();
    toggleVault(item._id);
    setShowMenu(false);
  };

  const formatSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const isEditable = (mimeType, name) => {
    const textExtensions = ['.txt', '.js', '.css', '.html', '.md', '.json', '.xml', '.py'];
    return !isFolder && (textExtensions.some(ext => name.toLowerCase().endsWith(ext)) || mimeType.startsWith('text/'));
  };

  const handleAIAnalyze = async () => {
    setShowAIModal(true);
    setIsAnalyzing(true);
    setShowMenu(false);
    try {
      const data = await analyzeFile(item._id);
      setAIInsights(data);
    } catch (err) {
      alert("AI Analysis failed");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleEditOpen = async () => {
    try {
      const content = await getFileContent(item._id);
      setEditContent(content);
      setShowEditModal(true);
      setShowMenu(false);
    } catch (err) {
      alert("Could not load file content");
    }
  };

  const handleSaveContent = async () => {
    setIsSaving(true);
    try {
      await updateFileContent(item._id, editContent);
      setShowEditModal(false);
    } catch (err) {
      alert("Error saving file");
    } finally {
      setIsSaving(false);
    }
  };

  const handleRename = (e) => {
    e.preventDefault();
    if (newName.trim()) {
      if (isFolder) {
        renameFolder(item._id, newName);
      } else {
        renameFile(item._id, newName);
      }
      setShowRenameModal(false);
    }
  };

  const handleCreateShareLink = async () => {
    try {
      const link = await getShareLink(item._id, shareExpiry, sharePassword);
      const fullLink = `${window.location.origin}/shared/${link}`;
      await navigator.clipboard.writeText(fullLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      alert(`Share link created and copied!\n${fullLink}`);
      setShowShareModal(false);
    } catch (err) {
      alert("Error creating share link");
    }
  };

  const handleShareWithUser = async (e) => {
    e.preventDefault();
    await shareWithUser(item._id, shareEmail);
    setShareEmail('');
    setShowShareModal(false);
  };

  const handleOpenFile = () => {
    const token = localStorage.getItem('token');
    window.open(`/api/files/open/${item._id}?token=${encodeURIComponent(token)}`, '_blank');
  };

  const [showPreview, setShowPreview] = useState(false);

  const isImage = () => !isFolder && item.mimeType?.startsWith('image/');
  const isVideo = () => !isFolder && item.mimeType?.startsWith('video/');

  const handlePreviewOpen = (e) => {
    e.stopPropagation();
    setShowPreview(true);
    setShowMenu(false);
  };

  const getDownloadUrl = () => {
    return `/api/files/open/${item._id}?token=${localStorage.getItem('token')}`;
  };

  return (
    <>
      <div 
        className="file-card"
        onMouseEnter={() => setShowMenu(true)}
        onMouseLeave={() => setShowMenu(false)}
        onDoubleClick={() => isFolder ? setCurrentFolder(item) : handleOpenFile()}
        style={{
          backgroundColor: 'var(--bg-card)',
          border: '1px solid var(--border-color)',
          borderRadius: '12px',
          padding: '1rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.75rem',
          cursor: 'pointer',
          transition: 'all 0.2s',
          position: 'relative',
          minHeight: (isImage() || isVideo()) ? '220px' : '160px'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          {(isImage() || isVideo()) ? (
            <div style={{ 
              width: '100%', 
              height: '120px', 
              borderRadius: '8px', 
              overflow: 'hidden',
              backgroundColor: 'rgba(0, 0, 0,0.02)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative'
            }}>
              {isImage() ? (
                <img 
                  src={getDownloadUrl()} 
                  alt={item.originalName}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                  <Video size={40} color="var(--accent)" />
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Video Asset</span>
                </div>
              )}
            </div>
          ) : (
            <div style={{ 
              color: isFolder ? '#fbbf24' : 'var(--accent)',
              backgroundColor: 'rgba(0, 0, 0, 0.05)',
              padding: '0.75rem',
              borderRadius: '10px'
            }}>
              {isFolder ? <Folder size={32} /> : <File size={32} />}
            </div>
          )}
          
          {showMenu && (
            <div style={{ position: 'absolute', top: '10px', right: '10px', zIndex: 10 }}>
              <div style={{
                backgroundColor: 'var(--bg-dark)',
                border: '1px solid var(--border-color)',
                borderRadius: '8px',
                padding: '0.5rem',
                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.5)',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.25rem',
                minWidth: '140px'
              }}>
                {!isFolder && (
                  <>
                    <button onClick={handleOpenFile} className="btn-menu"><ExternalLink size={14} /> Open</button>
                    <button onClick={handleAIAnalyze} className="btn-menu" style={{ color: '#a855f7' }}><Brain size={14} /> AI Insights</button>
                    <button onClick={handleVaultToggle} className="btn-menu" style={{ color: item.isVaulted ? '#10b981' : '#f59e0b' }}>
                      <Shield size={14} /> {item.isVaulted ? 'Unlock' : 'Vault'}
                    </button>
                    {isEditable(item.mimeType, item.originalName) && (
                      <button onClick={handleEditOpen} className="btn-menu"><Edit2 size={14} /> Edit</button>
                    )}
                    <button onClick={() => setShowShareModal(true)} className="btn-menu">
                      <Share2 size={14} /> Share
                    </button>
                  </>
                )}
                <button onClick={() => setShowRenameModal(true)} className="btn-menu"><Edit2 size={14} /> Rename</button>
                <button 
                  onClick={() => isFolder ? deleteFolder(item._id) : deleteFile(item._id)} 
                  className="btn-menu" 
                  style={{ color: 'var(--danger)' }}
                >
                  <Trash2 size={14} /> Delete
                </button>
              </div>
            </div>
          )}
        </div>

        <div>
          <h3 style={{ 
            fontSize: '0.9rem', 
            fontWeight: '600', 
            marginBottom: '0.2rem',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis'
          }}>
            {isFolder ? item.name : item.originalName}
          </h3>
          <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
            {isFolder ? 'Folder' : formatSize(item.size)}
          </p>
        </div>
      </div>

      {/* Preview Modal */}
      {showPreview && (
        <div className="modal-overlay" style={{ zIndex: 10001, backgroundColor: 'rgba(0,0,0,0.9)' }} onClick={() => setShowPreview(false)}>
           <div style={{ position: 'absolute', top: '20px', right: '20px', color: 'white', cursor: 'pointer' }} onClick={() => setShowPreview(false)}>
              <LogOut size={32} />
           </div>
           <div className="preview-container" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '90%', maxHeight: '90%' }}>
              {isImage() ? (
                <img src={getDownloadUrl()} alt={item.originalName} style={{ maxWidth: '100%', maxHeight: '80vh', borderRadius: '12px', boxShadow: '0 0 50px rgba(0,0,0,0.5)' }} />
              ) : isVideo() ? (
                <video controls autoPlay style={{ maxWidth: '100%', maxHeight: '80vh', borderRadius: '12px' }}>
                   <source src={getDownloadUrl()} type={item.mimeType} />
                   Your browser does not support the video tag.
                </video>
              ) : null}
              <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
                <h2 style={{ color: 'white', fontSize: '1.5rem', marginBottom: '0.5rem' }}>{item.originalName}</h2>
                <p style={{ color: 'var(--text-muted)' }}>{formatSize(item.size)} • {item.mimeType}</p>
              </div>
           </div>
        </div>
      )}

      {/* Modals moved outside the main card div to prevent event bubbling/blinking */}
      {showRenameModal && (
        <div className="modal-overlay" style={{ zIndex: 10000 }} onClick={() => setShowRenameModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2 style={{ marginBottom: '1.5rem', fontSize: '1.25rem' }}>Rename {isFolder ? 'Folder' : 'File'}</h2>
            <form onSubmit={handleRename}>
              <input 
                type="text" 
                className="input-field" 
                autoFocus
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                style={{ marginBottom: '1.5rem' }}
              />
              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                <button type="button" className="btn btn-outline" onClick={() => setShowRenameModal(false)}>Cancel</button>
                <button type="submit" className="btn">Rename</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showEditModal && (
        <div className="modal-overlay" style={{ zIndex: 10000 }} onClick={() => setShowEditModal(false)}>
          <div className="modal-content" style={{ maxWidth: '800px', width: '90%' }} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h2 style={{ fontSize: '1.25rem' }}>Editing {item.originalName}</h2>
              <button className="btn btn-outline" onClick={() => setShowEditModal(false)}>Close</button>
            </div>
            <textarea 
              style={{
                width: '100%',
                height: '400px',
                backgroundColor: 'var(--bg-dark)',
                color: 'var(--text-main)',
                border: '1px solid var(--border-color)',
                borderRadius: '8px',
                padding: '1rem',
                fontFamily: 'monospace',
                fontSize: '0.9rem',
                outline: 'none',
                resize: 'none'
              }}
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
            />
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
              <button className="btn" onClick={handleSaveContent} disabled={isSaving}>
                {isSaving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}

      {showShareModal && (
        <div className="modal-overlay" style={{ zIndex: 10000 }} onClick={() => setShowShareModal(false)}>
          <div className="modal-content" style={{ maxWidth: '450px' }} onClick={(e) => e.stopPropagation()}>
            <h2 style={{ marginBottom: '1.5rem', fontSize: '1.25rem' }}>Share {item.originalName}</h2>
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)' }}>
              <button onClick={() => setShareTab('link')} style={{ flex: 1, padding: '0.75rem', background: 'transparent', border: 'none', color: shareTab === 'link' ? 'var(--accent)' : 'var(--text-muted)', borderBottom: shareTab === 'link' ? '2px solid var(--accent)' : 'none', cursor: 'pointer' }}>Public Link</button>
              <button onClick={() => setShareTab('user')} style={{ flex: 1, padding: '0.75rem', background: 'transparent', border: 'none', color: shareTab === 'user' ? 'var(--accent)' : 'var(--text-muted)', borderBottom: shareTab === 'user' ? '2px solid var(--accent)' : 'none', cursor: 'pointer' }}>Specific User</button>
            </div>
            {shareTab === 'link' ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div><label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.5rem', display: 'block' }}>Expiry Date (Optional)</label><input type="date" className="input-field" value={shareExpiry} onChange={(e) => setShareExpiry(e.target.value)} /></div>
                <div><label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.5rem', display: 'block' }}>Password (Optional)</label><input type="password" placeholder="Leave blank for no password" className="input-field" value={sharePassword} onChange={(e) => setSharePassword(e.target.value)} /></div>
                <button className="btn" onClick={handleCreateShareLink} style={{ marginTop: '1rem' }}>Generate & Copy Link</button>
              </div>
            ) : (
              <form onSubmit={handleShareWithUser} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div><label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.5rem', display: 'block' }}>User Email</label><input type="email" placeholder="user@example.com" required className="input-field" value={shareEmail} onChange={(e) => setShareEmail(e.target.value)} /></div>
                <button type="submit" className="btn" style={{ marginTop: '1rem' }}>Share with User</button>
              </form>
            )}
            <button className="btn-outline" onClick={() => setShowShareModal(false)} style={{ width: '100%', marginTop: '1rem' }}>Cancel</button>
          </div>
        </div>
      )}

      {showAIModal && (
        <div className="modal-overlay" style={{ zIndex: 10000, backdropFilter: 'blur(8px)' }} onClick={() => setShowAIModal(false)}>
          <div className="modal-content glass-card" style={{ maxWidth: '520px', width: '92%', border: '1px solid rgba(168, 85, 247, 0.3)', boxShadow: '0 0 40px rgba(168, 85, 247, 0.15)', position: 'relative', overflow: 'hidden' }} onClick={(e) => e.stopPropagation()}>
            <div style={{ position: 'absolute', top: '-50px', right: '-50px', width: '150px', height: '150px', background: 'radial-gradient(circle, rgba(168, 85, 247, 0.15) 0%, transparent 70%)', filter: 'blur(30px)' }}></div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div className={isAnalyzing ? "pulse-icon" : ""} style={{ padding: '0.6rem', backgroundColor: 'rgba(168, 85, 247, 0.15)', borderRadius: '12px' }}><Brain size={28} color="#a855f7" /></div>
                <div><h2 style={{ fontSize: '1.25rem', fontWeight: '700', letterSpacing: '-0.5px' }}>Neural Insights</h2><p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>NexusDrive AI Engine v2.0</p></div>
              </div>
              <Sparkles size={20} color="#a855f7" style={{ opacity: 0.6 }} />
            </div>
            {isAnalyzing ? (
              <div style={{ textAlign: 'center', padding: '4rem 0' }}><div className="loader-container"><div className="loader-bar"></div></div><p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '1.5rem' }}>Initializing Synaptic Content Mapping...</p></div>
            ) : aiInsights ? (
              <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                
                {/* Format & Category Badges */}
                <div style={{ display: 'flex', gap: '0.75rem' }}>
                  <div style={{ 
                    flex: 1, padding: '0.75rem', backgroundColor: 'rgba(59, 130, 246, 0.1)', borderRadius: '10px', 
                    border: '1px solid rgba(59, 130, 246, 0.2)', display: 'flex', flexDirection: 'column', gap: '0.25rem'
                  }}>
                    <span style={{ fontSize: '0.65rem', color: '#60a5fa', fontWeight: '800', textTransform: 'uppercase' }}>Detected Format</span>
                    <span style={{ fontSize: '0.9rem', fontWeight: '700', color: 'var(--text-main)' }}>{aiInsights.format}</span>
                  </div>
                  <div style={{ 
                    flex: 1, padding: '0.75rem', backgroundColor: 'rgba(16, 185, 129, 0.1)', borderRadius: '10px', 
                    border: '1px solid rgba(16, 185, 129, 0.2)', display: 'flex', flexDirection: 'column', gap: '0.25rem'
                  }}>
                    <span style={{ fontSize: '0.65rem', color: '#34d399', fontWeight: '800', textTransform: 'uppercase' }}>AI Classification</span>
                    <span style={{ fontSize: '0.9rem', fontWeight: '700', color: 'var(--text-main)' }}>{aiInsights.category}</span>
                  </div>
                </div>

                <div style={{ padding: '1.25rem', backgroundColor: 'var(--bg-dark)', borderRadius: '14px', border: '1px solid var(--border-color)' }}>
                  <h4 style={{ fontSize: '0.75rem', color: '#a855f7', textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: '0.75rem', fontWeight: '800' }}>{aiInsights.type === 'image' ? 'Visual Interpretation' : 'Core Summary'}</h4>
                  <p style={{ fontSize: '1rem', lineHeight: '1.6', color: 'var(--text-main)' }}>{aiInsights.description || aiInsights.summary}</p>
                </div>

                <div>
                  <h4 style={{ fontSize: '0.75rem', color: '#a855f7', textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: '1rem', fontWeight: '800' }}>Contextual Semantic Tags</h4>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.6rem' }}>{(aiInsights.tags || aiInsights.keywords).map((tag, idx) => (<span key={tag} className="tag-appear" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.5rem 0.9rem', backgroundColor: 'rgba(168, 85, 247, 0.1)', color: '#c084fc', borderRadius: '10px', fontSize: '0.8rem', fontWeight: '600', animationDelay: `${idx * 0.1}s`, border: '1px solid rgba(168, 85, 247, 0.2)' }}><Tag size={13} /> {tag}</span>))}</div>
                </div>
                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                   <div style={{ flex: 1, minWidth: '150px', padding: '1rem', backgroundColor: 'var(--bg-dark)', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                     <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginBottom: '0.4rem', fontWeight: '600' }}>ANALYSIS ACCURACY</p>
                     <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><div style={{ flex: 1, height: '4px', background: 'var(--border-color)', borderRadius: '2px', overflow: 'hidden' }}><div style={{ width: `${(aiInsights.confidence || 0.95) * 100}%`, height: '100%', background: '#a855f7' }}></div></div><span style={{ fontSize: '0.9rem', fontWeight: '800', color: '#a855f7' }}>{((aiInsights.confidence || 0.95) * 100).toFixed(0)}%</span></div>
                   </div>
                   <div style={{ flex: 1, minWidth: '150px', padding: '1rem', backgroundColor: 'var(--bg-dark)', borderRadius: '12px', border: '1px solid var(--border-color)' }}><p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginBottom: '0.4rem', fontWeight: '600' }}>EMOTIONAL TONE</p><p style={{ fontSize: '1rem', fontWeight: '800', color: 'var(--text-main)' }}>{aiInsights.sentiment || 'Neutral'}</p></div>
                </div>

                {/* AI Suggestions */}
                <div style={{ backgroundColor: 'rgba(245, 158, 11, 0.05)', padding: '1.25rem', borderRadius: '14px', border: '1px solid rgba(245, 158, 11, 0.2)' }}>
                   <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                     <Sparkles size={16} color="#f59e0b" />
                     <h4 style={{ fontSize: '0.75rem', color: '#f59e0b', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: '800' }}>Neural Suggestions</h4>
                   </div>
                   <ul style={{ paddingLeft: '1.2rem', margin: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                     {aiInsights.suggestions.map((s, i) => (
                       <li key={i} style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{s}</li>
                     ))}
                   </ul>
                </div>
              </div>
            ) : null}
            <button className="btn" onClick={() => setShowAIModal(false)} style={{ width: '100%', marginTop: '2.5rem', background: 'linear-gradient(135deg, #a855f7 0%, #7e22ce 100%)', boxShadow: '0 4px 15px rgba(168, 85, 247, 0.3)', border: 'none' }}>Close Engine</button>
          </div>
        </div>
      )}

      <style>{`
        @keyframes pulse-icon { 0% { box-shadow: 0 0 0 0 rgba(168, 85, 247, 0.4); } 70% { box-shadow: 0 0 0 15px rgba(168, 85, 247, 0); } 100% { box-shadow: 0 0 0 0 rgba(168, 85, 247, 0); } }
        .pulse-icon { animation: pulse-icon 2s infinite; }
        .loader-container { width: 100%; height: 6px; background: #222; border-radius: 3px; overflow: hidden; position: relative; }
        .loader-bar { width: 40%; height: 100%; background: #a855f7; position: absolute; left: -40%; animation: loading 1.5s infinite ease-in-out; border-radius: 3px; }
        @keyframes loading { 0% { left: -40%; } 100% { left: 100%; } }
        .fade-in { animation: fadeIn 0.6s ease-out forwards; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .tag-appear { opacity: 0; transform: scale(0.9); animation: tagAppear 0.4s ease-out forwards; }
        @keyframes tagAppear { to { opacity: 1; transform: scale(1); } }
        .btn-menu { background: transparent; border: none; color: var(--text-main); display: flex; align-items: center; gap: 0.5rem; padding: 0.5rem 0.75rem; width: 100%; text-align: left; cursor: pointer; border-radius: 4px; font-size: 0.85rem; }
        .btn-menu:hover { background-color: var(--bg-hover); }
        .file-card { transition: all 0.2s; }
        .file-card:hover { transform: translateY(-4px); border-color: var(--accent); boxShadow: 0 10px 20px -5px rgba(0, 0, 0, 0.4); }
        .preview-container { display: flex; flex-direction: column; align-items: center; justify-content: center; }
      `}</style>
    </>
  );
};

export default FileCard;
