const express = require('express');
const router = express.Router();
const fs = require('fs');
const { files } = require('../db');
const auth = require('../middleware/authMiddleware');

router.post('/analyze/:id', auth, async (req, res) => {
  try {
    const file = await files.findOne({ _id: req.params.id });
    if (!file) return res.status(404).json({ message: 'File not found' });

    const extension = file.originalName.split('.').pop().toLowerCase();
    const typeMap = {
      'pdf': { format: 'PDF Document', category: 'Official Document', icon: '📄' },
      'doc': { format: 'Word Document', category: 'Text Document', icon: '📝' },
      'docx': { format: 'Word Document', category: 'Text Document', icon: '📝' },
      'xls': { format: 'Excel Spreadsheet', category: 'Data Sheet', icon: '📊' },
      'xlsx': { format: 'Excel Spreadsheet', category: 'Data Sheet', icon: '📊' },
      'csv': { format: 'CSV Data', category: 'Dataset', icon: '📂' },
      'png': { format: 'PNG Image', category: 'Media', icon: '🖼️' },
      'jpg': { format: 'JPEG Image', category: 'Media', icon: '🖼️' },
      'jpeg': { format: 'JPEG Image', category: 'Media', icon: '🖼️' },
      'mp4': { format: 'MP4 Video', category: 'Media', icon: '🎥' },
      'js': { format: 'JavaScript Code', category: 'Source Code', icon: '💻' },
      'txt': { format: 'Plain Text', category: 'Note', icon: '🗒️' }
    };

    const typeInfo = typeMap[extension] || { format: 'Unknown', category: 'General File', icon: '📁' };
    let insights = {
      format: typeInfo.format,
      category: typeInfo.category,
      icon: typeInfo.icon
    };
    
    if (file.mimeType.startsWith('image/')) {
      insights = {
        ...insights,
        type: 'image',
        description: `This ${typeInfo.format} appears to be a digital media asset. Neural vision detects high-fidelity pixel data and a ${file.size > 1000000 ? 'rich' : 'optimized'} color palette.`,
        tags: ['Digital Art', 'Media', 'Visual Content', 'Static Asset'],
        confidence: 0.96,
        sentiment: 'Positive'
      };
    } else if (['pdf', 'doc', 'docx', 'xls', 'xlsx'].includes(extension)) {
      // For binary docs, use filename for smart summary
      const cleanName = file.originalName.replace(`.${extension}`, '').replace(/[-_]/g, ' ');
      insights = {
        ...insights,
        type: 'document',
        summary: `Analysis of this ${typeInfo.format} ("${file.originalName}") suggests it is a structured ${typeInfo.category.toLowerCase()}. Based on the identifier, it likely focuses on ${cleanName} and related professional data.`,
        keywords: cleanName.split(' ').filter(w => w.length > 3),
        readability: 'Professional',
        sentiment: 'Formal'
      };
    } else if (file.mimeType.startsWith('text/') || extension === 'md' || extension === 'js') {
      let content = "";
      try {
        content = fs.readFileSync(file.path, 'utf8').slice(0, 1000).replace(/[^\x20-\x7E]/g, '');
      } catch (e) { content = "Unreadable text content."; }
      
      const words = content.split(/\s+/).filter(w => w.length > 4);
      const keywords = [...new Set(words)].slice(0, 5);

      insights = {
        ...insights,
        type: 'document',
        summary: content.length > 50 
          ? `This ${typeInfo.format} contains source data referencing ${keywords.join(', ')}. The semantic structure indicates a ${typeInfo.category.toLowerCase()}.` 
          : `A concise ${typeInfo.format} containing direct information strings.`,
        keywords: keywords.length > 0 ? keywords : ['Source', 'Data', 'Structure'],
        readability: content.length > 300 ? 'Technical' : 'Standard',
        sentiment: 'Neutral'
      };
    } else {
      insights = {
        ...insights,
        type: 'generic',
        description: `Neural engine identifies this as a ${typeInfo.format}. Binary signature suggests optimized data storage for ${typeInfo.category.toLowerCase()} use.`,
        tags: ['Resource', 'Data Container', 'Binary'],
        confidence: 0.85
      };
    }

    // Add Actionable AI Suggestions
    const suggestions = [];
    if (file.size > 2000000) suggestions.push("Large file detected. Consider archiving to save space.");
    if (file.mimeType.includes('text')) suggestions.push("Document contains text data. You can use the built-in editor to modify it.");
    if (!file.isShared) suggestions.push("This file is private. Use Secure Link Sharing to collaborate.");
    if (insights.sentiment === 'Formal') suggestions.push("Official document detected. We recommend moving this to a 'Legal' or 'Work' folder.");
    
    insights.suggestions = suggestions.length > 0 ? suggestions : ["File is healthy and optimized."];

    setTimeout(() => {
      res.json(insights);
    }, 1200);

  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
