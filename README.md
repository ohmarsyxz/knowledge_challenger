# 🚀 Slides PRO — Premium Markdown Presentation Workspace

**Slides PRO** is a premium, developer-focused Next.js web application designed to instantly turn local Markdown (`.md`) files into stunning, interactive presentation slides. 

Rather than editing slides inside a web-based text box, **Slides PRO** connects directly to your local file system. You can draft presentation decks in your favorite IDE (VS Code, Cursor, Gemini), and the slides update in real-time on your screen as soon as you press **Save** on disk.

---

## 💎 Core Features

*   **⚡ Real-Time IDE Sync (Workspace Watcher)**: Edit presentations locally in your IDE. Saving automatically hot-reloads the slides in the browser in under 50ms using Next.js backend polling.
*   **📂 Multi-Deck Directory**: Manage multiple presentation slide decks by storing `.md` files in the local `slides/` directory. Hot-swap between files instantly using the deck selector menu.
*   **🎨 Premium Curated Themes**: Toggle between four beautiful layouts:
    *   🔮 *Dark Glassmorphism* (neon-blurred glass cards)
    *   🎨 *Editorial Light* (high-fashion editorial typography)
    *   ⚡ *Cyberpunk Accent* (fluorescent grid scanlines)
    *   🔳 *Minimalist Monotone* (stark contrast architectural simplicity)
*   **📐 Heuristic Auto-Layouts**: Automatically structures slides into responsive layouts:
    *   *Title Layout* (only headings, centered vertically)
    *   *Split Layout* (images and text displayed in a 50/50 split column)
    *   *Code Card Layout* (code block rendered in a mockup macOS window alongside description text)
    *   *Default Layout* (standard bullet points, lists, quotes, and paragraphs)
*   **📺 Bidirectional Presenter Console**: Launch a separate synchronized Presenter window with an active stopwatch, slide progress counters, current/next slide previews, and large speaker notes. Uses the native `BroadcastChannel` API for sub-millisecond local network sync.
*   **🖥️ Fullscreen Present Mode**: Trigger a gorgeous, hardware-accelerated fullscreen overlay using a `ResizeObserver` aspect-ratio sandbox that dynamically scales slides to fit any monitor without text overflow.
*   **🔍 SEO & Performance Optimized**: Built with Next.js 16 Server Components, semantic HTML5 layout containers, and fully optimized metadata title tags.

---

## 🛠️ Getting Started

### 1. Install Dependencies
Run this command inside the project root:
```bash
npm install
```

### 2. Start the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your web browser.

### 3. Add & Edit Presentation Files
1.  Open the `/slides` directory in the project root.
2.  Open any existing presentation file (e.g., `pitch-deck.md` or `tech-roadmap.md`) in your preferred IDE.
3.  Write slides, hit **Save**, and watch the browser preview reload instantly.
4.  Create new `.md` files inside the `/slides` directory to start a new deck. They will show up in the web header's **Select Deck** dropdown list.

---

## ✍️ How to Write Slides (Quick Cheat Sheet)

All slides are separated by **three dashes** `---` on a line by themselves. 

### Title Slide
```markdown
# NextGen AI Platform
## The Future of Autonomous Intelligence
```

### Split Screen Slide (Image + Text)
```markdown
# Premium Design Aesthetics
![Workspace Art](https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80)
- Space is the ultimate luxury.
- Vibrant color scales and micro-animations.
```

### Code Card Slide
```markdown
# Edge API Handler
- Zero cold starts.
- CDN edge caching.

```typescript
export async function GET(req: Request) {
  return Response.json({ active: true });
}
```
```

### Adding Speaker Notes
Place speaker notes at the bottom of any slide page using a `Note:` prefix:
```markdown
# Q3 Roadmap
- edge migration
- live drawing sync

Note: Keep explanations short. Focus on edges nodes latency benefits.
```

> [!TIP]
> For a complete deep-dive into formatting, layout syntax, image sizing, and slide writing tips, refer to the project's customized agent instructions in [presentation-writer SKILL.md](file:///Users/suphachai/workspace/project/knowledge_challenger/.agents/skills/presentation-writer/SKILL.md).
