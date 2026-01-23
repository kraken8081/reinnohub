import fetch from 'node-fetch';
import { mockProjects } from '../src/data/mockProjects';

const API_URL = 'http://localhost:3000/api/projects';

async function seed() {
  console.log('🌱 Starting database seeding...');

  try {
    // Check if DB is empty (optional, but good for safety)
    const checkRes = await fetch(API_URL);
    const existing = await checkRes.json();

    if (Array.isArray(existing) && existing.length > 0) {
      console.log(`⚠️  Database already has ${existing.length} projects. Skipping seed.`);
      return;
    }

    console.log(`📦 Found ${mockProjects.length} projects to insert.`);

    for (const project of mockProjects) {
      const { id, createdAt, ...data } = project; // Remove ID to let backend generate it

      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        console.error(`❌ Failed to insert "${project.title}": ${response.statusText}`);
      } else {
        console.log(`✅ Inserted: ${project.title}`);
      }
    }

    console.log('✨ Seeding completed!');
  } catch (error) {
    console.error('❌ Seeding failed:', error);
  }
}

seed();
