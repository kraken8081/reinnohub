import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import { getDb } from '../services/database.js';

const router = express.Router();

// GET /api/projects - Get all projects
router.get('/', async (req, res) => {
  try {
    const db = await getDb();
    const projects = await db.all('SELECT * FROM projects ORDER BY createdAt DESC');

    // Parse tags from JSON string
    const formattedProjects = projects.map(p => ({
      ...p,
      tags: JSON.parse(p.tags || '[]')
    }));

    res.json(formattedProjects);
  } catch (error) {
    console.error('Error fetching projects:', error);
    res.status(500).json({ error: 'Failed to fetch projects' });
  }
});

// GET /api/projects/:id - Get single project
router.get('/:id', async (req, res) => {
  try {
    const db = await getDb();
    const project = await db.get('SELECT * FROM projects WHERE id = ?', req.params.id);

    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    res.json({
      ...project,
      tags: JSON.parse(project.tags || '[]')
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch project' });
  }
});

// POST /api/projects - Create new project
router.post('/', async (req, res) => {
  const { title, description, url, imageUrl, tags, content } = req.body;

  if (!title || !description || !url) {
    return res.status(400).json({ error: 'Title, description, and URL are required' });
  }

  try {
    const db = await getDb();
    const id = uuidv4();
    const now = new Date().toISOString();

    await db.run(
      `INSERT INTO projects (id, title, description, url, imageUrl, tags, content, createdAt, updatedAt)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [id, title, description, url, imageUrl || '', JSON.stringify(tags || []), content || '', now, now]
    );

    const newProject = await db.get('SELECT * FROM projects WHERE id = ?', id);
    res.status(201).json({
      ...newProject,
      tags: JSON.parse(newProject.tags)
    });
  } catch (error) {
    console.error('Error creating project:', error);
    res.status(500).json({ error: 'Failed to create project' });
  }
});

// PUT /api/projects/:id - Update project
router.put('/:id', async (req, res) => {
  const { title, description, url, imageUrl, tags, content } = req.body;

  try {
    const db = await getDb();
    const project = await db.get('SELECT * FROM projects WHERE id = ?', req.params.id);

    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    const now = new Date().toISOString();

    // Build update query dynamically
    await db.run(
      `UPDATE projects
       SET title = COALESCE(?, title),
           description = COALESCE(?, description),
           url = COALESCE(?, url),
           imageUrl = COALESCE(?, imageUrl),
           tags = COALESCE(?, tags),
           content = COALESCE(?, content),
           updatedAt = ?
       WHERE id = ?`,
      [
        title,
        description,
        url,
        imageUrl,
        tags ? JSON.stringify(tags) : null,
        content,
        now,
        req.params.id
      ]
    );

    const updatedProject = await db.get('SELECT * FROM projects WHERE id = ?', req.params.id);
    res.json({
      ...updatedProject,
      tags: JSON.parse(updatedProject.tags)
    });
  } catch (error) {
    console.error('Error updating project:', error);
    res.status(500).json({ error: 'Failed to update project' });
  }
});

// DELETE /api/projects/:id - Delete project
router.delete('/:id', async (req, res) => {
  try {
    const db = await getDb();
    const result = await db.run('DELETE FROM projects WHERE id = ?', req.params.id);

    if (result.changes === 0) {
      return res.status(404).json({ error: 'Project not found' });
    }

    res.json({ message: 'Project deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete project' });
  }
});

export default router;
