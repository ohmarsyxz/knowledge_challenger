import fs from 'fs';
import path from 'path';

// This endpoint holds a long-lived connection and watches the filesystem, so it
// must run on the Node.js runtime and never be cached or statically evaluated.
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

interface SlideSnapshot {
  files: string[];
  activeFile: string;
  mtime: number;
}

function readSnapshot(requestedFile: string | null): SlideSnapshot | null {
  const slidesDir = path.join(process.cwd(), 'slides');
  if (!fs.existsSync(slidesDir)) return null;

  const files = fs
    .readdirSync(slidesDir)
    .filter((f) => f.endsWith('.md'))
    .sort();
  if (files.length === 0) return null;

  const activeFile =
    requestedFile && files.includes(requestedFile) ? requestedFile : files[0];
  const mtime = fs.statSync(path.join(slidesDir, activeFile)).mtimeMs;

  return { files, activeFile, mtime };
}

export function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const requestedFile = searchParams.get('file');
  const slidesDir = path.join(process.cwd(), 'slides');

  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    start(controller) {
      let closed = false;
      let lastPayload = '';
      let debounce: ReturnType<typeof setTimeout> | null = null;

      const send = (event: string, data: unknown) => {
        if (closed) return;
        controller.enqueue(
          encoder.encode(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`)
        );
      };

      // Only emit when the snapshot actually differs from what we last sent,
      // so fs.watch's duplicate events don't turn into duplicate pushes.
      const pushSnapshot = () => {
        const snap = readSnapshot(requestedFile);
        if (!snap) return;
        const serialized = JSON.stringify(snap);
        if (serialized === lastPayload) return;
        lastPayload = serialized;
        send('slides', snap);
      };

      // Coalesce the burst of events an editor fires on a single save.
      const onChange = () => {
        if (debounce) clearTimeout(debounce);
        debounce = setTimeout(pushSnapshot, 80);
      };

      let watcher: fs.FSWatcher | null = null;
      try {
        watcher = fs.watch(slidesDir, onChange);
      } catch {
        // Directory may not exist yet; the client falls back to reconnecting.
      }

      // Heartbeat keeps proxies from dropping an otherwise-silent connection.
      const heartbeat = setInterval(() => {
        if (closed) return;
        controller.enqueue(encoder.encode(': keep-alive\n\n'));
      }, 30_000);

      // Prime the client with current state immediately on connect.
      pushSnapshot();

      const cleanup = () => {
        if (closed) return;
        closed = true;
        if (debounce) clearTimeout(debounce);
        clearInterval(heartbeat);
        watcher?.close();
        try {
          controller.close();
        } catch {
          // Already closed by the runtime.
        }
      };

      req.signal.addEventListener('abort', cleanup);
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream; charset=utf-8',
      'Cache-Control': 'no-cache, no-transform',
      Connection: 'keep-alive',
      'X-Content-Type-Options': 'nosniff',
    },
  });
}
