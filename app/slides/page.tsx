import React from 'react';
import fs from 'fs';
import path from 'path';
import PresentationWorkspace from '../../components/presenter/PresentationWorkspace';

export default async function Page() {
  const slidesDir = path.join(process.cwd(), 'slides');

  // 1. Ensure slides directory exists
  if (!fs.existsSync(slidesDir)) {
    fs.mkdirSync(slidesDir, { recursive: true });
  }

  // 2. Read available files
  let files = fs.readdirSync(slidesDir)
    .filter((file) => file.endsWith('.md'))
    .sort();

  // 3. Populate default slide if slides/ folder is empty
  if (files.length === 0) {
    const defaultPath = path.join(slidesDir, 'welcome.md');
    const defaultContent = `# Welcome to your Slides Folder\n## Add more .md files here to create new presentations\n---\n# How to use\n- Place any markdown file (.md) inside the **slides/** folder\n- Switch between them in the selector menu above!\n`;
    fs.writeFileSync(defaultPath, defaultContent, 'utf-8');
    files = ['welcome.md'];
  }

  // 4. Default active file and read its content
  const activeFile = files[0];
  const activeFilePath = path.join(slidesDir, activeFile);
  const markdown = fs.readFileSync(activeFilePath, 'utf-8');

  return (
    <PresentationWorkspace
      initialFiles={files}
      initialActiveFile={activeFile}
      initialMarkdown={markdown}
    />
  );
}
