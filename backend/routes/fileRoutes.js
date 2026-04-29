const express = require('express');
const router = express.Router();
const multer = require('multer');
const { v4: uuidv4 } = require('uuid');
const path = require('path');
const fs = require('fs');
const bcrypt = require('bcryptjs');
const { files, users, activities } = require('../db');
const auth = require('../middleware/authMiddleware');

// Helper for logging
const logActivity = async (userId, action, targetName) => {
  await activities.insert({
    user: userId,
    action,
    targetName,
    timestamp: new Date()
  });
};

// Setup multer for local storage
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    const uploadPath = path.join(__dirname, '../uploads/');
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath);
    }
    cb(null, uploadPath);
  },
  filename: function(req, file, cb) {
    cb(null, uuidv4() + path.extname(file.originalname));
  }
});
const upload = multer({ storage });

// Upload file
router.post('/upload', auth, upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      console.log("Upload failed: No file in request");
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const { folder } = req.body;
    console.log(`Uploading file: ${req.file.originalname}, Folder: ${folder || 'Root'}`);

    const newFile = await files.insert({
      filename: req.file.filename,
      originalName: req.file.originalname,
      size: req.file.size,
      mimeType: req.file.mimetype,
      path: req.file.path,
      user: req.user.id,
      folder: folder || null,
      sharedWith: [],
      isVaulted: false,
      createdAt: new Date()
    });

    await logActivity(req.user.id, 'Upload', req.file.originalname);
    res.json(newFile);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// Get all files for user
router.get('/', auth, async (req, res) => {
  try {
    const isVaulted = req.query.vaulted === 'true';
    const ownerQuery = { user: req.user.id };
    const vaultQuery = isVaulted ? { isVaulted: true } : { $or: [{ isVaulted: false }, { isVaulted: { $exists: false } }] };
    
    const folderId = req.query.folderId;
    if (folderId !== undefined) {
      ownerQuery.folder = (folderId === 'root') ? null : folderId;
    }
    
    const userFiles = await files.find({ ...ownerQuery, ...vaultQuery });
    const sharedWithMe = await files.find({ sharedWith: req.user.id, ...vaultQuery });
    res.json({ myFiles: userFiles, sharedWithMe });
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// Toggle Vault Status
router.post('/vault/:id', auth, async (req, res) => {
  try {
    const file = await files.findOne({ _id: req.params.id, user: req.user.id });
    if (!file) return res.status(404).json({ message: 'File not found' });

    const updated = await files.update(
      { _id: req.params.id },
      { $set: { isVaulted: !file.isVaulted } }
    );

    // Log Activity
    await activities.insert({
      user: req.user.id,
      action: file.isVaulted ? 'Removed from Vault' : 'Moved to Vault',
      targetName: file.originalName,
      timestamp: new Date()
    });

    res.json({ message: 'Vault status updated' });
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// Rename file
router.put('/:id/rename', auth, async (req, res) => {
  try {
    const { name } = req.body;
    let file = await files.findOne({ _id: req.params.id });
    if (!file) return res.status(404).json({ message: 'File not found' });
    if (file.user !== req.user.id) return res.status(401).json({ message: 'Not authorized' });

    const oldName = file.originalName;
    const updated = await files.update({ _id: req.params.id }, { $set: { originalName: name } }, { returnUpdatedDocs: true });
    
    await logActivity(req.user.id, 'Rename', `${oldName} -> ${name}`);
    res.json(updated);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// Delete file
router.delete('/:id', auth, async (req, res) => {
  try {
    const file = await files.findOne({ _id: req.params.id });
    if (!file) return res.status(404).json({ message: 'File not found' });
    if (file.user !== req.user.id) return res.status(401).json({ message: 'Not authorized' });

    if (fs.existsSync(file.path)) {
      fs.unlinkSync(file.path);
    }
    await files.remove({ _id: req.params.id });
    
    await logActivity(req.user.id, 'Delete', file.originalName);
    res.json({ message: 'File removed' });
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// Open file (Serve inline)
router.get('/open/:id', auth, async (req, res) => {
  try {
    const file = await files.findOne({ _id: req.params.id });
    if (!file) return res.status(404).json({ message: 'File not found' });
    
    // Allow if owner or if shared with user
    if (file.user !== req.user.id && !file.sharedWith?.includes(req.user.id)) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    res.set('Content-Type', file.mimeType);
    res.set('Content-Disposition', 'inline');
    res.sendFile(file.path);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// Advanced Generate share link
router.post('/share/:id', auth, async (req, res) => {
  try {
    let file = await files.findOne({ _id: req.params.id });
    if (!file) return res.status(404).json({ message: 'File not found' });
    if (file.user !== req.user.id) return res.status(401).json({ message: 'Not authorized' });

    const { expiresAt, password } = req.body;
    
    let shareLink = uuidv4();
    let hashedPassword = null;
    if (password) {
      const salt = await bcrypt.genSalt(10);
      hashedPassword = await bcrypt.hash(password, salt);
    }

    await files.update({ _id: req.params.id }, { 
      $set: { 
        shareLink,
        shareExpiresAt: expiresAt ? new Date(expiresAt) : null,
        sharePassword: hashedPassword
      } 
    });
    
    await logActivity(req.user.id, 'Share Link Created', file.originalName);
    res.json({ shareLink });
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// Share with specific user by email
router.post('/share-user/:id', auth, async (req, res) => {
  try {
    const { email } = req.body;
    const targetUser = await users.findOne({ email });
    if (!targetUser) return res.status(404).json({ message: 'User not found' });

    const file = await files.findOne({ _id: req.params.id });
    if (!file) return res.status(404).json({ message: 'File not found' });
    if (file.user !== req.user.id) return res.status(401).json({ message: 'Not authorized' });

    await files.update(
      { _id: req.params.id }, 
      { $addToSet: { sharedWith: targetUser._id } }
    );

    await logActivity(req.user.id, 'Shared with User', `${file.originalName} with ${email}`);
    res.json({ message: `File shared with ${email}` });
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// Access shared file info
router.get('/shared-info/:link', async (req, res) => {
  try {
    const file = await files.findOne({ shareLink: req.params.link });
    if (!file) return res.status(404).json({ message: 'File not found' });

    // Check expiry
    if (file.shareExpiresAt && new Date() > new Date(file.shareExpiresAt)) {
      return res.status(410).json({ message: 'Share link has expired' });
    }

    const owner = await users.findOne({ _id: file.user });

    res.json({
      id: file._id,
      originalName: file.originalName,
      size: file.size,
      mimeType: file.mimeType,
      sharedBy: owner ? owner.username : 'Unknown User',
      createdAt: file.createdAt,
      passwordProtected: !!file.sharePassword
    });
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// Access shared file inline
router.post('/shared/:link', async (req, res) => {
  try {
    const { password } = req.body;
    const file = await files.findOne({ shareLink: req.params.link });
    if (!file) return res.status(404).json({ message: 'File not found' });

    if (file.shareExpiresAt && new Date() > new Date(file.shareExpiresAt)) {
      return res.status(410).json({ message: 'Share link has expired' });
    }

    if (file.sharePassword) {
      if (!password) return res.status(401).json({ message: 'Password required' });
      const isMatch = await bcrypt.compare(password, file.sharePassword);
      if (!isMatch) return res.status(401).json({ message: 'Incorrect password' });
    }

    res.set('Content-Type', file.mimeType);
    res.set('Content-Disposition', 'inline');
    res.sendFile(file.path);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// Update file content
router.put('/:id/content', auth, async (req, res) => {
  try {
    const { content } = req.body;
    const file = await files.findOne({ _id: req.params.id });
    if (!file) return res.status(404).json({ message: 'File not found' });
    if (file.user !== req.user.id) return res.status(401).json({ message: 'Not authorized' });

    fs.writeFileSync(file.path, content);
    const stats = fs.statSync(file.path);
    await files.update({ _id: req.params.id }, { $set: { size: stats.size } });

    await logActivity(req.user.id, 'Edit', file.originalName);
    res.json({ message: 'File updated' });
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// Get file content
router.get('/:id/content', auth, async (req, res) => {
  try {
    const file = await files.findOne({ _id: req.params.id });
    if (!file) return res.status(404).json({ message: 'File not found' });
    if (file.user !== req.user.id && !file.sharedWith?.includes(req.user.id)) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    const content = fs.readFileSync(file.path, 'utf8');
    res.send(content);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

module.exports = router;
