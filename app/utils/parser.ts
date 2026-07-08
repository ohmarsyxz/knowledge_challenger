import { Slide, SlideElement, LayoutType, ElementType } from '../types';

export function parseMarkdownToSlides(markdown: string): Slide[] {
  const lines = markdown.split(/\r?\n/);
  const slidesRaw: string[][] = [];
  let currentSlideLines: string[] = [];
  let inCodeBlock = false;

  // Split into slides based on '---', being careful not to split inside code blocks
  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed.startsWith('```')) {
      inCodeBlock = !inCodeBlock;
    }

    if (!inCodeBlock && trimmed === '---') {
      slidesRaw.push(currentSlideLines);
      currentSlideLines = [];
    } else {
      currentSlideLines.push(line);
    }
  }
  if (currentSlideLines.length > 0 || slidesRaw.length === 0) {
    slidesRaw.push(currentSlideLines);
  }

  return slidesRaw.map((slideLines, index) => {
    const raw = slideLines.join('\n');
    const elements: SlideElement[] = [];
    let notes = '';
    
    let isParsingNotes = false;
    let inSlideCodeBlock = false;
    let currentCodeLanguage = '';
    let currentCodeLines: string[] = [];

    let currentListType: 'ul' | 'ol' | null = null;
    let currentListItems: string[] = [];

    // Helper to flush current lists to elements
    const flushList = () => {
      if (currentListType && currentListItems.length > 0) {
        elements.push({
          type: currentListType,
          content: '',
          items: [...currentListItems],
        });
        currentListItems = [];
        currentListType = null;
      }
    };

    // Parse line by line
    let i = 0;
    while (i < slideLines.length) {
      const line = slideLines[i];
      const trimmed = line.trim();

      // 1. Handle code blocks
      if (trimmed.startsWith('```')) {
        flushList();
        if (inSlideCodeBlock) {
          // End of code block
          elements.push({
            type: 'code',
            content: currentCodeLines.join('\n'),
            language: currentCodeLanguage,
          });
          currentCodeLines = [];
          currentCodeLanguage = '';
          inSlideCodeBlock = false;
        } else {
          // Start of code block
          inSlideCodeBlock = true;
          currentCodeLanguage = trimmed.slice(3).trim() || 'plaintext';
        }
        i++;
        continue;
      }

      if (inSlideCodeBlock) {
        currentCodeLines.push(line);
        i++;
        continue;
      }

      // 2. Handle HTML Comment Speaker Notes (e.g. <!-- note ... --> or multiline <!-- note ...)
      if (trimmed.startsWith('<!--') && (trimmed.toLowerCase().includes('note') || trimmed.toLowerCase().includes('notes'))) {
        flushList();
        isParsingNotes = true;
        
        // Check if notes end on the same line
        if (trimmed.endsWith('-->')) {
          // Extract notes inside
          const content = trimmed.replace(/^<!--\s*(note|notes):?\s*/i, '').replace(/\s*-->$/, '');
          notes += (notes ? '\n' : '') + content;
          isParsingNotes = false;
        } else {
          // Multiline comment
          let content = trimmed.replace(/^<!--\s*(note|notes):?\s*/i, '');
          notes += (notes ? '\n' : '') + content;
        }
        i++;
        continue;
      }

      if (isParsingNotes) {
        if (trimmed.endsWith('-->')) {
          const content = trimmed.replace(/\s*-->$/, '');
          notes += (notes ? '\n' : '') + content;
          isParsingNotes = false;
        } else {
          notes += (notes ? '\n' : '') + line;
        }
        i++;
        continue;
      }

      // 3. Handle explicit Note: or Notes: text prefixes
      const noteRegex =/^(notes?):\s*(.*)/i;
      const noteMatch = line.match(noteRegex);
      if (noteMatch) {
        flushList();
        notes += (notes ? '\n' : '') + noteMatch[2];
        i++;
        // Gather all remaining lines in the slide as notes
        while (i < slideLines.length) {
          notes += '\n' + slideLines[i];
          i++;
        }
        break;
      }

      // 4. Skip blank lines but flush list
      if (trimmed === '') {
        flushList();
        i++;
        continue;
      }

      // 5. Parse headings
      const headingMatch = line.match(/^(#{1,6})\s+(.*)/);
      if (headingMatch) {
        flushList();
        const level = headingMatch[1].length;
        elements.push({
          type: `h${level}` as ElementType,
          content: headingMatch[2].trim(),
        });
        i++;
        continue;
      }

      // 6. Parse lists
      const ulMatch = line.match(/^(\s*)[-*+]\s+(.*)/);
      if (ulMatch) {
        if (currentListType === 'ol') {
          flushList();
        }
        currentListType = 'ul';
        currentListItems.push(ulMatch[1] + ulMatch[2].trim());
        i++;
        continue;
      }

      const olMatch = line.match(/^(\s*)(\d+)\.\s+(.*)/);
      if (olMatch) {
        if (currentListType === 'ul') {
          flushList();
        }
        currentListType = 'ol';
        currentListItems.push(olMatch[1] + olMatch[3].trim());
        i++;
        continue;
      }

      // 7. Parse images: ![alt](src)
      const imageMatch = line.match(/^!\[(.*?)\]\((.*?)\)/);
      if (imageMatch) {
        flushList();
        elements.push({
          type: 'image',
          content: '',
          alt: imageMatch[1],
          src: imageMatch[2],
        });
        i++;
        continue;
      }

      // 8. Parse blockquotes: > text
      const blockquoteMatch = line.match(/^>\s*(.*)/);
      if (blockquoteMatch) {
        flushList();
        elements.push({
          type: 'blockquote',
          content: blockquoteMatch[1].trim(),
        });
        i++;
        continue;
      }

      // 9. Default to paragraphs
      flushList();
      elements.push({
        type: 'paragraph',
        content: line.trim(),
      });
      i++;
    }

    // Flush any trailing lists
    flushList();

    // Determine layout heuristic
    let layout: LayoutType = 'default';
    const hasImage = elements.some((el) => el.type === 'image');
    const hasCode = elements.some((el) => el.type === 'code');
    const hasText = elements.some((el) => ['paragraph', 'ul', 'ol', 'blockquote'].includes(el.type));
    const headingCount = elements.filter((el) => el.type.startsWith('h')).length;
    const totalCount = elements.length;

    if (hasCode) {
      layout = 'code';
    } else if (hasImage && hasText) {
      layout = 'split';
    } else if (headingCount > 0 && headingCount === totalCount) {
      layout = 'title';
    }

    return {
      id: index + 1,
      raw,
      elements,
      notes: notes.trim(),
      layout,
    };
  });
}
