import React, { useContext, useEffect } from 'react';
import { FileContext } from '../context/FileContext';
import { History, Upload, Trash2, Edit2, Share2 } from 'lucide-react';

const Activities = () => {
  const { activities, fetchActivities } = useContext(FileContext);

  useEffect(() => {
    fetchActivities();
  }, [fetchActivities]);

  const getIcon = (action) => {
    switch (action) {
      case 'Upload': return <Upload size={16} color="#10b981" />;
      case 'Delete': return <Trash2 size={16} color="#ef4444" />;
      case 'Edit': return <Edit2 size={16} color="#3b82f6" />;
      case 'Share Link Created': return <Share2 size={16} color="#a855f7" />;
      case 'Shared with User': return <Share2 size={16} color="#ec4899" />;
      case 'Rename': return <Edit2 size={16} color="#f59e0b" />;
      default: return <History size={16} />;
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2rem' }}>
        <History size={24} color="var(--accent)" />
        <h1 style={{ fontSize: '1.5rem', fontWeight: '700' }}>Activity Log</h1>
      </div>

      <div style={{ backgroundColor: 'var(--bg-card)', borderRadius: '12px', border: '1px solid var(--border-color)', overflow: 'hidden' }}>
        {activities.length > 0 ? (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '500px' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-color)', backgroundColor: 'rgba(0, 0, 0,0.02)' }}>
                  <th style={{ padding: '1rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>Action</th>
                  <th style={{ padding: '1rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>Target</th>
                  <th style={{ padding: '1rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>Timestamp</th>
                </tr>
              </thead>
              <tbody>
                {activities.map((log) => (
                  <tr key={log._id} style={{ borderBottom: '1px solid var(--border-color)', transition: 'background 0.2s' }}>
                    <td style={{ padding: '1rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      {getIcon(log.action)}
                      <span style={{ fontWeight: '500' }}>{log.action}</span>
                    </td>
                    <td style={{ padding: '1rem', fontSize: '0.9rem' }}>{log.targetName}</td>
                    <td style={{ padding: '1rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      {new Date(log.timestamp).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div style={{ padding: '4rem', textAlign: 'center', color: 'var(--text-muted)' }}>
            No activity recorded yet.
          </div>
        )}
      </div>
    </div>
  );
};

export default Activities;
