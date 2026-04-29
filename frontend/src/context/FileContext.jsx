import React, { createContext, useState, useContext, useCallback } from 'react';
import axios from 'axios';
import { AuthContext } from './AuthContext';

export const FileContext = createContext();

export const FileProvider = ({ children }) => {
  const [files, setFiles] = useState([]);
  const [sharedWithMe, setSharedWithMe] = useState([]);
  const [folders, setFolders] = useState([]);
  const [activities, setActivities] = useState([]);
  const [currentFolder, setCurrentFolder] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState(null);
  const { user } = useContext(AuthContext);

  const getHeaders = () => {
    return { 'x-auth-token': localStorage.getItem('token') };
  };

  const fetchFilesAndFolders = useCallback(async (vaulted = false) => {
    if (!user) return;
    try {
      const [filesRes, foldersRes] = await Promise.all([
        axios.get(`/api/files?vaulted=${vaulted}`, { headers: getHeaders() }),
        axios.get('/api/folders', { headers: getHeaders() })
      ]);
      setFiles(filesRes.data.myFiles);
      setSharedWithMe(filesRes.data.sharedWithMe);
      setFolders(foldersRes.data);
    } catch (err) {
      console.error("Error fetching data:", err);
    }
  }, [user]);

  const toggleVault = async (id) => {
    try {
      await axios.post(`/api/files/vault/${id}`, {}, { headers: getHeaders() });
      fetchFilesAndFolders();
    } catch (err) {
      console.error("Vault toggle error:", err);
    }
  };

  const fetchActivities = useCallback(async () => {
    if (!user) return;
    try {
      const res = await axios.get('/api/activities', { headers: getHeaders() });
      setActivities(res.data);
    } catch (err) {
      console.error("Error fetching activities:", err);
    }
  }, [user]);

  const uploadFile = async (fileData, folderId) => {
    const formData = new FormData();
    formData.append('file', fileData);
    if (folderId) formData.append('folder', folderId);

    try {
      await axios.post('/api/files/upload', formData, {
        headers: { ...getHeaders(), 'Content-Type': 'multipart/form-data' }
      });
      fetchFilesAndFolders();
    } catch (err) {
      console.error("Upload error:", err);
      throw err;
    }
  };

  const createFolder = async (name, parentFolder) => {
    try {
      await axios.post('/api/folders', { name, parentFolder }, { headers: getHeaders() });
      fetchFilesAndFolders();
    } catch (err) {
      console.error("Error creating folder:", err);
      throw err;
    }
  };

  const deleteFile = async (id) => {
    try {
      await axios.delete(`/api/files/${id}`, { headers: getHeaders() });
      fetchFilesAndFolders();
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  const renameFile = async (id, name) => {
    try {
      await axios.put(`/api/files/${id}/rename`, { name }, { headers: getHeaders() });
      fetchFilesAndFolders();
    } catch (err) {
      console.error("Rename error:", err);
    }
  };

  const deleteFolder = async (id) => {
    try {
      await axios.delete(`/api/folders/${id}`, { headers: getHeaders() });
      fetchFilesAndFolders();
    } catch (err) {
      console.error("Delete folder error:", err);
    }
  };

  const renameFolder = async (id, name) => {
    try {
      await axios.put(`/api/folders/${id}/rename`, { name }, { headers: getHeaders() });
      fetchFilesAndFolders();
    } catch (err) {
      console.error("Rename folder error:", err);
    }
  };

  const getShareLink = async (id, expiresAt, password) => {
    try {
      const res = await axios.post(`/api/files/share/${id}`, { expiresAt, password }, { headers: getHeaders() });
      return res.data.shareLink;
    } catch (err) {
      console.error("Share error:", err);
      throw err;
    }
  };

  const shareWithUser = async (id, email) => {
    try {
      await axios.post(`/api/files/share-user/${id}`, { email }, { headers: getHeaders() });
      alert("File shared successfully");
    } catch (err) {
      alert(err.response?.data?.message || "Error sharing file");
    }
  };

  const getFileContent = async (id) => {
    try {
      const res = await axios.get(`/api/files/${id}/content`, { headers: getHeaders() });
      return res.data;
    } catch (err) {
      console.error("Get content error:", err);
      throw err;
    }
  };

  const updateFileContent = async (id, content) => {
    try {
      await axios.put(`/api/files/${id}/content`, { content }, { headers: getHeaders() });
      fetchFilesAndFolders();
    } catch (err) {
      console.error("Update content error:", err);
      throw err;
    }
  };

  const analyzeFile = async (id) => {
    try {
      const res = await axios.post(`/api/ai/analyze/${id}`, {}, { headers: getHeaders() });
      return res.data;
    } catch (err) {
      console.error("AI Analysis error:", err);
      throw err;
    }
  };

  return (
    <FileContext.Provider value={{
      files, folders, sharedWithMe, activities, currentFolder, setCurrentFolder,
      searchTerm, setSearchTerm, category, setCategory,
      fetchFilesAndFolders, fetchActivities, uploadFile, createFolder,
      deleteFile, renameFile, deleteFolder, renameFolder, toggleVault,
      getShareLink, shareWithUser, getFileContent, updateFileContent, analyzeFile
    }}>
      {children}
    </FileContext.Provider>
  );
};
