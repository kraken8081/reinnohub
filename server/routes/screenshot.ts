import express from 'express';
import puppeteer from 'puppeteer-core';
import { v4 as uuidv4 } from 'uuid';
import { getDb } from '../services/database.js';

const router = express.Router();

// Chrome path on macOS
const CHROME_PATH = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';

router.post('/', async (req, res) => {
  const { url } = req.body;
  console.log(`[Smart Extract] Request received for: ${url}`);

  if (!url) {
    return res.status(400).json({ error: 'URL is required' });
  }

  let browser;
  try {
    const db = await getDb();

    // 1. Check if image already exists in DB (Cache Check)
    const existing = await db.get('SELECT id FROM project_images WHERE source_url = ?', url);
    let imageUrl = '';
    let isCached = false;

    if (existing) {
      console.log(`[Smart Extract] Found cached image for ${url}`);
      imageUrl = `/api/images/${existing.id}`;
      isCached = true;
    }

    // 2. Launch Browser (if not cached OR we always want to extract fresh text)
    // For "Smart Fill", we should probably always visit the page to get text,
    // but we can skip screenshot if cached.
    // However, keeping it simple: always visit to get metadata.

    console.log('[Smart Extract] Launching browser...');
    browser = await puppeteer.launch({
      executablePath: CHROME_PATH,
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 960 });

    console.log(`[Smart Extract] Navigating to ${url}...`);
    await page.goto(url, { waitUntil: 'networkidle2', timeout: 60000 });

    // 3. Extract Metadata
    console.log('[Smart Extract] Extracting page metadata...');
    const metadata = await page.evaluate(() => {
      // Inline all logic to avoid scope/transpilation issues

      // Title
      let title = document.title;
      const h1 = document.querySelector('h1');
      const ogTitle = document.querySelector('meta[property="og:title"]');
      if (ogTitle && ogTitle.getAttribute('content')) {
        title = ogTitle.getAttribute('content') || title;
      } else if (h1) {
        title = h1.innerText.trim() || title;
      }

      // Description
      let description = '';
      const metaDesc = document.querySelector('meta[name="description"]');
      const ogDesc = document.querySelector('meta[property="og:description"]');
      if (metaDesc && metaDesc.getAttribute('content')) {
        description = metaDesc.getAttribute('content') || '';
      } else if (ogDesc && ogDesc.getAttribute('content')) {
        description = ogDesc.getAttribute('content') || '';
      } else {
        const firstP = document.querySelector('p');
        if (firstP) {
          description = firstP.innerText.trim().substring(0, 300);
        }
      }

      // Keywords
      let keywords = '';
      const metaKeywords = document.querySelector('meta[name="keywords"]');
      if (metaKeywords && metaKeywords.getAttribute('content')) {
        keywords = metaKeywords.getAttribute('content') || '';
      }

      // Content
      let content = '';
      const article = document.querySelector('article');
      const main = document.querySelector('main');
      if (article) {
        content = article.innerText.trim();
      } else if (main) {
        content = main.innerText.trim();
      } else {
        content = document.body.innerText.trim();
      }

      return { title, description, keywords, content };
    });

    // 4. Handle Screenshot (if not cached)
    if (!isCached) {
      console.log('[Smart Extract] Capturing image buffer...');
      const buffer = await page.screenshot({ encoding: 'binary' });

      const id = uuidv4();
      const now = new Date().toISOString();

      await db.run(
        'INSERT INTO project_images (id, source_url, data, mime_type, created_at) VALUES (?, ?, ?, ?, ?)',
        [id, url, buffer, 'image/png', now]
      );
      imageUrl = `/api/images/${id}`;
      console.log(`[Smart Extract] Screenshot saved with ID: ${id}`);
    }

    await browser.close();
    browser = null;

    // 5. Return Combined Data
    res.json({
      message: 'Extraction successful',
      url: imageUrl,
      meta: {
        title: metadata.title || '',
        description: metadata.description || '',
        content: metadata.content || '',
        tags: metadata.keywords ? metadata.keywords.split(',').map((k: string) => k.trim()).slice(0, 5) : []
      }
    });

  } catch (error) {
    console.error('[Smart Extract] Error:', error);
    if (browser) await browser.close();
    res.status(500).json({ error: 'Failed to process URL. Make sure it is valid.' });
  }
});

export default router;
