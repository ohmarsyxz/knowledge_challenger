import { Template } from '../types';

export const TEMPLATES: Template[] = [
  {
    id: 'pitch-deck',
    name: '🚀 Startup Pitch Deck',
    description: 'A premium startup deck containing titles, 2-column details, stats, and speaker notes.',
    markdown: `# NextGen AI Platform
## The Future of Autonomous Intelligence
---
# The Core Problem
- Information overload in fast-paced software environments
- Loss of contextual knowledge during developer handoffs
- Outdated docs causing millions in lost productivity

Note: Start strong. Explain how the problem affects developers every single day. Keep tone energetic!
---
# The Ultimate Solution
![Product Concept](https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80)
- **Instant Context Discovery**
  Automated mapping of system knowledge.
- **Dynamic Slide Creation**
  Type markdown and present instantly.
- **Interactive Presenter Syncing**
  Seamless control of dual screens.
---
# Business Model
## Scaling to Hyper-Growth
- **Lite Plan** — Free, up to 3 active presentations.
- **Pro Plan** — $12/mo, unlimited presentations & Custom Fonts.
- **Enterprise** — Custom pricing, single sign-on, and self-hosting.
---
# Join The Revolution
## Let's Build the Future Together
### contact@nextgen.ai
`,
  },
  {
    id: 'tech-roadmap',
    name: '🛠️ Tech Roadmap & Demo',
    description: 'Technical slide deck showing architecture roadmap, system configurations, and code blocks.',
    markdown: `# Q3 Tech Roadmap
## Scalability & Performance Upgrades
---
# Core Architecture
- Migration of the rendering engine to the edge.
- Introduction of custom incremental static regeneration.
- Sub-10ms response times globally.
---
# Implementation Code
## Fast Next.js 16 API Handler
\`\`\`typescript
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const data = { status: 'healthy', timestamp: Date.now() };
  return NextResponse.json(data, {
    headers: { 'Cache-Control': 's-maxage=3600' }
  });
}
\`\`\`
Note: Emphasize that the s-maxage header enables caching at the CDN edge level for ultra-low latency.
---
# Q3 Deliverables
1. Core Parser Refactor (July)
2. Interactive Drawing Canvas (August)
3. Multi-user Live Collaboration (September)
---
# System Architecture Status
## 100% Cloud-Native
![Cloud Infrastructure](https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=800&q=80)
`,
  },
  {
    id: 'elegant-portfolio',
    name: '🎨 Creative Showcase',
    description: 'Clean, elegant, editorial layout with beautiful imagery and minimal typography.',
    markdown: `# Visual Editorial
## Creative Portfolio of Minimal Art
---
# Philosophy of Less
- Space is the ultimate luxury.
- Content defines the layout, not the other way around.
- Grayscale palette highlights form over distraction.
---
# Abstract Form
![Abstract Art](https://images.unsplash.com/photo-1604871000636-074fa5117945?auto=format&fit=crop&w=800&q=80)
- **Concept A**
  Curated shadows and high-contrast composition.
- **Concept B**
  Symmetric layouts and structural clarity.
---
# Selected Works
- The Monolith Series (2025)
- Glassmorphic Architecture (2026)
- Organic Gradients (Ongoing)
---
# The End
## Thank You for Watching
`,
  },
];
