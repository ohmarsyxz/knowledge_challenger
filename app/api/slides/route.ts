import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const requestedFile = searchParams.get('file');

    const slidesDir = path.join(process.cwd(), 'slides');

    // 1. Ensure slides directory exists
    if (!fs.existsSync(slidesDir)) {
      fs.mkdirSync(slidesDir, { recursive: true });
    }

    // 2. Read all .md files inside slides directory
    let files = fs.readdirSync(slidesDir)
      .filter((file) => file.endsWith('.md'))
      .sort();

    // 3. Fallback: if empty, create a welcome file
    if (files.length === 0) {
      const defaultPath = path.join(slidesDir, 'welcome.md');
      const defaultContent = `# Welcome to your Slides Folder\n## Add more .md files here to create new presentations\n---\n# How to use\n- Place any markdown file (.md) inside the **slides/** folder\n- Switch between them in the selector menu above!\n`;
      fs.writeFileSync(defaultPath, defaultContent, 'utf-8');
      files = ['welcome.md'];
    }

    // 4. Determine which file to read
    const activeFile = requestedFile && files.includes(requestedFile) 
      ? requestedFile 
      : files[0];

    const activeFilePath = path.join(slidesDir, activeFile);
    const content = fs.readFileSync(activeFilePath, 'utf-8');
    const stats = fs.statSync(activeFilePath);

    return NextResponse.json({
      markdown: content,
      mtime: stats.mtimeMs,
      files: files,
      activeFile: activeFile,
    }, {
      headers: {
        'Cache-Control': 'no-store, max-age=0',
      }
    });
  } catch (error) {
    console.error('Error handling slides:', error);
    return NextResponse.json({ error: 'Failed to process slides' }, { status: 500 });
  }
}
