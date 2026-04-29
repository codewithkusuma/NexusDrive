const express = require('express');
const router = express.Router();
const { folders } = require('../db');
const auth = require('../middleware/authMiddleware');

// Get all folders for user
router.get('/', auth, async (req, res) => {
  try {
    const userFolders = await folders.find({ user: req.user.id });
    res.json(userFolders);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// Create folder
router.post('/', auth, async (req, res) => {
  try {
    const { name, parentFolder } = req.body;
    const folder = await folders.insert({
      name,
      user: req.user.id,
      parentFolder: parentFolder || null,
      createdAt: new Date()
    });
    res.json(folder);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// Delete folder
router.delete('/:id', auth, async (req, res) => {
  try {
    const folder = await folders.findOne({ _id: req.params.id });
    if (!folder) return res.status(404).json({ message: 'Folder not found' });
    if (folder.user !== req.user.id) return res.status(401).json({ message: 'Not authorized' });

    await folders.remove({ _id: req.params.id });
    res.json({ message: 'Folder removed' });
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// Rename folder
router.put('/:id/rename', auth, async (req, res) => {
  try {
    const { name } = req.body;
    let folder = await folders.findOne({ _id: req.params.id });
    if (!folder) return res.status(404).json({ message: 'Folder not found' });
    if (folder.user !== req.user.id) return res.status(401).json({ message: 'Not authorized' });

    const updated = await folders.update({ _id: req.params.id }, { $set: { name } }, { returnUpdatedDocs: true });
    res.json(updated);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

module.exports = router;
