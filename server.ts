import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import fs from 'fs';
import http from 'http';
import { spawn, ChildProcess } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const C_SERVER_PORT = 9095;
let cServerProcess: ChildProcess | null = null;
let isShuttingDown = false;
const backendCDir = path.join(__dirname, 'backend-c');

/**
 * Check if the C REST server is running and responding with 200 OK
 */
function isCBackendHealthy(): Promise<boolean> {
  return new Promise((resolve) => {
    const req = http.get(
      `http://127.0.0.1:${C_SERVER_PORT}/api/c-backend/status`,
      { timeout: 800 },
      (res) => {
        if (res.statusCode === 200) {
          res.resume();
          resolve(true);
        } else {
          res.resume();
          resolve(false);
        }
      }
    );
    req.on('error', () => resolve(false));
    req.on('timeout', () => {
      req.destroy();
      resolve(false);
    });
  });
}

let startingPromise: Promise<boolean> | null = null;

/**
 * Ensures C REST HTTP Server is compiled, marked executable, and active
 */
async function ensureCBackendRunning(): Promise<boolean> {
  if (await isCBackendHealthy()) {
    return true;
  }

  if (startingPromise) {
    return startingPromise;
  }

  startingPromise = (async () => {
    try {
      const cServerBin = path.join(backendCDir, 'c_http_server');
      const cEngineBin = path.join(backendCDir, 'c_engine');
      const dbPath = path.join(backendCDir, 'tracker.db');

      // Guarantee execution permissions on C binaries
      try {
        if (fs.existsSync(cServerBin)) {
          fs.chmodSync(cServerBin, 0o755);
        }
        if (fs.existsSync(cEngineBin)) {
          fs.chmodSync(cEngineBin, 0o755);
        }
      } catch (err: any) {
        console.warn('[C Backend Chmod Warning]:', err.message);
      }

      // If an old process handle is dead/stale, clear it
      if (cServerProcess) {
        try {
          cServerProcess.kill();
        } catch {}
        cServerProcess = null;
      }

      console.log(`[C Backend] Launching C HTTP REST Server on port ${C_SERVER_PORT}...`);
      cServerProcess = spawn(cServerBin, ['--port', String(C_SERVER_PORT), '--db', dbPath], {
        cwd: backendCDir,
        stdio: 'inherit',
      });

      cServerProcess.on('error', (err) => {
        console.error('[C Backend Error] Spawn error:', err.message);
      });

      cServerProcess.on('exit', (code, sig) => {
        console.log(`[C Backend] Process exited with code ${code}, signal ${sig}`);
        cServerProcess = null;
        if (!isShuttingDown) {
          setTimeout(() => {
            ensureCBackendRunning().catch(console.error);
          }, 1000);
        }
      });

      // Poll until healthy (up to 30 attempts x 100ms = 3.0s)
      for (let i = 0; i < 30; i++) {
        await new Promise((r) => setTimeout(r, 100));
        if (await isCBackendHealthy()) {
          console.log(`[C Backend] C HTTP REST Server verified active on port ${C_SERVER_PORT}`);
          return true;
        }
      }

      console.warn(`[C Backend Warning] C server did not respond within 3s on port ${C_SERVER_PORT}`);
      return false;
    } finally {
      startingPromise = null;
    }
  })();

  return startingPromise;
}

/**
 * Forward an HTTP request to the local C HTTP REST Server with retry support
 */
function forwardRequestToC(
  req: express.Request,
  res: express.Response,
  bodyBuffer: Buffer,
  retryCount = 0
) {
  const targetPath = req.originalUrl;
  const clientHeaders: Record<string, any> = { ...req.headers };
  clientHeaders['host'] = `127.0.0.1:${C_SERVER_PORT}`;

  const proxyReq = http.request(
    {
      hostname: '127.0.0.1',
      port: C_SERVER_PORT,
      path: targetPath,
      method: req.method,
      headers: clientHeaders,
    },
    (proxyRes) => {
      res.writeHead(proxyRes.statusCode || 200, proxyRes.headers);
      proxyRes.pipe(res, { end: true });
    }
  );

  proxyReq.on('error', async (err: any) => {
    console.error(`[C Proxy Error] Failed to proxy ${req.method} ${targetPath}:`, err.message);

    // Auto-heal and retry once on connection refusal or reset
    if (retryCount === 0 && (err.code === 'ECONNREFUSED' || err.code === 'ECONNRESET')) {
      console.log('[C Proxy] Connection refused. Restarting C backend and retrying request...');
      await ensureCBackendRunning();
      forwardRequestToC(req, res, bodyBuffer, retryCount + 1);
      return;
    }

    if (!res.headersSent) {
      res.status(502).json({
        success: false,
        error: `Unable to reach C Backend REST Server on port ${C_SERVER_PORT}.`,
        details: err.message,
      });
    }
  });

  if (bodyBuffer.length > 0) {
    proxyReq.write(bodyBuffer);
  }
  proxyReq.end();
}

async function startServer() {
  const app = express();
  const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
  const isProd = process.env.NODE_ENV === 'production';

  // Guarantee C Backend is running before accepting web requests
  await ensureCBackendRunning();

  // Route /api/* directly to C REST Server on 127.0.0.1:9095
  app.use('/api', (req, res) => {
    const chunks: Buffer[] = [];
    req.on('data', (chunk) => {
      chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk);
    });
    req.on('end', async () => {
      const bodyBuffer = Buffer.concat(chunks);
      if (!(await isCBackendHealthy())) {
        await ensureCBackendRunning();
      }
      forwardRequestToC(req, res, bodyBuffer);
    });
  });

  // Mount Vite middleware in dev or static dist in production
  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Web application server listening on port ${PORT}`);
    console.log(`Routing /api/* -> C Backend HTTP REST Server on 127.0.0.1:${C_SERVER_PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});

// Clean up child process on exit
process.on('SIGINT', () => {
  isShuttingDown = true;
  if (cServerProcess) cServerProcess.kill();
  process.exit();
});
process.on('SIGTERM', () => {
  isShuttingDown = true;
  if (cServerProcess) cServerProcess.kill();
  process.exit();
});
