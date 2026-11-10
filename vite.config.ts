import react from '@vitejs/plugin-react';
import { defineConfig, loadEnv, type Plugin, type ViteDevServer, type PreviewServer } from 'vite';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const KNOWN_ROUTES = new Set([
  '/',
  '/lien-he',
  '/chinh-sach-bao-mat',
  '/dang-ky-thanh-cong',
]);

/**
 * Plugin phục vụ trực tiếp API tiếp nhận lead tại /api/consultation trong môi trường dev và preview
 */
function apiEndpointPlugin(): Plugin {
  return {
    name: 'api-consultation-endpoint',
    configureServer(server: ViteDevServer) {
      server.middlewares.use(async (req, res, next) => {
        const [rawPath] = (req.url || '').split('?');

        if (rawPath === '/api/consultation') {
          res.setHeader('Access-Control-Allow-Origin', '*');
          res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
          res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-Idempotency-Key');

          if (req.method === 'OPTIONS') {
            res.statusCode = 204;
            res.end();
            return;
          }

          if (req.method === 'POST') {
            try {
              const { handleLeadSubmission } = (await server.ssrLoadModule('/server/leadHandler.ts')) as {
                handleLeadSubmission: (payload: any, clientIp: string) => Promise<{ status: number; body: any }>;
              };

              const chunks: Uint8Array[] = [];
              for await (const chunk of req) {
                chunks.push(chunk as Uint8Array);
              }
              const rawBody = Buffer.concat(chunks).toString('utf-8');
              let payload: any = {};
              if (rawBody.trim()) {
                try {
                  payload = JSON.parse(rawBody);
                } catch {
                  res.statusCode = 400;
                  res.setHeader('Content-Type', 'application/json');
                  res.end(JSON.stringify({ success: false, statusCode: 'VALIDATION_ERROR', message: 'Dữ liệu JSON không hợp lệ.' }));
                  return;
                }
              }

              const clientIp =
                (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() ||
                req.socket?.remoteAddress ||
                '127.0.0.1';

              const result = await handleLeadSubmission(payload, clientIp);

              res.statusCode = result.status;
              res.setHeader('Content-Type', 'application/json; charset=utf-8');
              res.end(JSON.stringify(result.body));
              return;
            } catch (err: unknown) {
              console.error('[Vite API Endpoint Error]', err);
              res.statusCode = 500;
              res.setHeader('Content-Type', 'application/json');
              res.end(
                JSON.stringify({
                  success: false,
                  statusCode: 'SERVICE_UNAVAILABLE',
                  message: 'Lỗi xử lý tiếp nhận yêu cầu từ máy chủ.',
                })
              );
              return;
            }
          }
        }

        next();
      });
    },
    configurePreviewServer(server: PreviewServer) {
      server.middlewares.use(async (req, res, next) => {
        const [rawPath] = (req.url || '').split('?');
        if (rawPath === '/api/consultation') {
          res.setHeader('Access-Control-Allow-Origin', '*');
          res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
          res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-Idempotency-Key');

          if (req.method === 'OPTIONS') {
            res.statusCode = 204;
            res.end();
            return;
          }

          if (req.method === 'POST') {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json; charset=utf-8');
            res.end(
              JSON.stringify({
                success: false,
                isDemo: true,
                statusCode: 'DEMO_MODE',
                message:
                  'Thông tin đã được kiểm tra trên bản demo. Chưa có dữ liệu được gửi đến đơn vị tư vấn.',
              })
            );
            return;
          }
        }
        next();
      });
    },
  };
}

/**
 * Plugin kiểm soát mã phản hồi HTTP 404 cho các route không tồn tại
 */
function notFoundHttpPlugin(): Plugin {
  return {
    name: 'not-found-http-status',
    configureServer(server: ViteDevServer) {
      server.middlewares.use(async (req, res, next) => {
        if (!req.url || (req.method !== 'GET' && req.method !== 'HEAD')) return next();

        const [rawPath] = req.url.split('?');
        // Bỏ qua các đường dẫn nội bộ của Vite, asset tĩnh và API endpoints
        if (
          rawPath.startsWith('/@') ||
          rawPath.startsWith('/src/') ||
          rawPath.startsWith('/node_modules/') ||
          rawPath.startsWith('/api/') ||
          rawPath.includes('.')
        ) {
          return next();
        }

        const accept = req.headers.accept || '';
        // Chỉ xử lý các yêu cầu điều hướng trang mong đợi HTML
        if (!accept.includes('text/html') && !accept.includes('*/*')) {
          return next();
        }

        const normalized =
          rawPath.length > 1 && rawPath.endsWith('/')
            ? rawPath.slice(0, -1)
            : rawPath;

        // Nếu là route hợp lệ, để Vite phục vụ mã 200
        if (KNOWN_ROUTES.has(normalized)) {
          return next();
        }

        // Route không tồn tại: trả về HTTP status 404 thật kèm index.html
        try {
          res.statusCode = 404;
          res.setHeader('Content-Type', 'text/html; charset=utf-8');
          if (req.method === 'HEAD') {
            res.end();
            return;
          }
          const indexPath = path.resolve(server.config.root, 'index.html');
          const rawHtml = fs.readFileSync(indexPath, 'utf-8');
          const transformedHtml = await server.transformIndexHtml(req.url, rawHtml);
          res.end(transformedHtml);
        } catch (e) {
          next(e);
        }
      });
    },
    configurePreviewServer(server: PreviewServer) {
      server.middlewares.use((req, res, next) => {
        if (!req.url || (req.method !== 'GET' && req.method !== 'HEAD')) return next();

        const [rawPath] = req.url.split('?');
        if (rawPath.startsWith('/api/') || rawPath.includes('.')) return next();

        const accept = req.headers.accept || '';
        if (!accept.includes('text/html') && !accept.includes('*/*')) {
          return next();
        }

        const normalized =
          rawPath.length > 1 && rawPath.endsWith('/')
            ? rawPath.slice(0, -1)
            : rawPath;

        if (KNOWN_ROUTES.has(normalized)) {
          return next();
        }

        try {
          res.statusCode = 404;
          res.setHeader('Content-Type', 'text/html; charset=utf-8');
          if (req.method === 'HEAD') {
            res.end();
            return;
          }
          const distIndexPath = path.resolve(server.config.root, 'dist', 'index.html');
          if (fs.existsSync(distIndexPath)) {
            const html = fs.readFileSync(distIndexPath, 'utf-8');
            res.end(html);
            return;
          }
        } catch {
          // fallback
        }
        next();
      });
    },
    closeBundle() {
      // Sao chép index.html thành 404.html trong thư mục dist để các hosting tĩnh (GitHub Pages, Cloudflare) phục vụ HTTP 404
      const distDir = path.resolve(__dirname, 'dist');
      const indexPath = path.join(distDir, 'index.html');
      const notFoundPath = path.join(distDir, '404.html');
      if (fs.existsSync(indexPath)) {
        fs.copyFileSync(indexPath, notFoundPath);
      }
    },
  };
}

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  Object.assign(process.env, env);

  return {
    plugins: [react(), apiEndpointPlugin(), notFoundHttpPlugin()],
  };
});
