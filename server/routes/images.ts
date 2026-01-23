import express from 'express';
import { getDb } from '../services/database.js';

const router = express.Router();

// GET /api/images/:id - Serve image from database
router.get('/:id', async (req, res) => {
  try {
    const db = await getDb();
    const image = await db.get('SELECT * FROM project_images WHERE id = ?', req.params.id);

    if (!image) {
      return res.status(404).send('Image not found');
    }

    res.setHeader('Content-Type', image.mime_type);
    res.setHeader('Cache-Control', 'public, max-age=31536000'); // Cache for 1 year
    res.send(image.data);
  } catch (error) {
    console.error('Error serving image:', error);
    res.status(500).send('Failed to serve image');
  }
});

export default router;
