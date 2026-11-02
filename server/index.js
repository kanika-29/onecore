import './config/env.js';
import dns from 'dns';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

// Prioritize IPv4 over IPv6 for local service resolution in Node 18+
try {
  dns.setDefaultResultOrder('ipv4first');
} catch {}

import authRoutes from './routes/authRoutes.js';
import dashboardRoutes from './routes/dashboardRoutes.js';
import contactsRoutes from './routes/contactsRoutes.js';
import therapeuticAreasRoutes from './routes/therapeuticAreasRoutes.js';
import productsRoutes from './routes/productsRoutes.js';
import newsRoutes from './routes/newsRoutes.js';
import pagesRoutes from './routes/pagesRoutes.js';
import mediaRoutes from './routes/mediaRoutes.js';
import settingsRoutes from './routes/settingsRoutes.js';
import adminUsersRoutes from './routes/adminUsersRoutes.js';
import { errorHandler } from './middleware/errorMiddleware.js';
import { testConnection } from './config/db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import { getStoragePaths, findUploadedFile } from './utils/storage.js';

// Auto-detect Hostinger persistent shared storage
const { sharedDir: sharedUploadsDir } = getStoragePaths(__dirname);
const customUploadsDir = process.env.UPLOADS_DIR ? path.resolve(process.env.UPLOADS_DIR) : null;
const uploadsDir = path.resolve(__dirname, 'uploads');
const parentUploadsDir = path.resolve(__dirname, '..', 'uploads');

if (customUploadsDir && !fs.existsSync(customUploadsDir)) {
  try { fs.mkdirSync(customUploadsDir, { recursive: true }); } catch {}
}
if (!fs.existsSync(uploadsDir)) {
  try { fs.mkdirSync(uploadsDir, { recursive: true }); } catch {}
}
if (!fs.existsSync(parentUploadsDir)) {
  try { fs.mkdirSync(parentUploadsDir, { recursive: true }); } catch {}
}

const app = express();
// Express port and listener configuration compatible with both TCP and Passenger Unix Domain Sockets
const PORT = process.env.PORT || 3000;


// Crucial behind Hostinger LiteSpeed / Nginx reverse proxy
app.set('trust proxy', 1);

// Lightweight Request Duration Logger (Sanitized, production-safe observability)
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    if (req.originalUrl.startsWith('/api') || duration > 1000 || res.statusCode >= 400) {
      console.log(`[HTTP] ${req.method} ${req.originalUrl} ${res.statusCode} ${duration}ms`);
    }
  });
  next();
});

// Immediate Liveness Check (<1ms, no DB query, never rate-limited)
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    uptime: Math.floor(process.uptime()),
    service: 'Onecore Pharma API',
    timestamp: new Date().toISOString(),
  });
});

// Readiness Check (Validates DB connectivity with non-blocking 3s timeout)
app.get('/api/health/db', async (req, res) => {
  try {
    const isConnected = await testConnection(3000);
    if (isConnected) {
      return res.status(200).json({
        status: 'connected',
        database: process.env.DB_NAME || 'u222341186_onecore',
        timestamp: new Date().toISOString(),
      });
    }
    return res.status(503).json({
      status: 'disconnected',
      message: 'Database connection failed or timed out',
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    return res.status(503).json({
      status: 'error',
      message: err.message,
      timestamp: new Date().toISOString(),
    });
  }
});

// Security & Middlewares
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' },
}));

// Normalize duplicate /uploads/uploads/ URLs
app.use((req, res, next) => {
  if (req.url.startsWith('/uploads/uploads/')) {
    req.url = req.url.replace('/uploads/uploads/', '/uploads/');
  }
  next();
});

const allowedOrigins = [
  'http://localhost:3000',
  'http://127.0.0.1:3000',
  'http://localhost:5173',
  'http://127.0.0.1:5173',
];

app.use(cors({
  origin: (origin, callback) => {
    // allow requests with no origin (like mobile apps, curl, server-to-server)
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      return callback(null, true);
    }
    return callback(null, true); // Dev convenience fallback
  },
  credentials: true,
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Global Rate Limiter
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 300, // max 300 requests per IP
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again later.',
  },
});
app.use('/api', globalLimiter);

// Disable Cache Staleness across all API routes
app.use('/api', (req, res, next) => {
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  next();
});

// Auth Limiter (Strict for login brute force prevention)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20, // 20 login attempts per 15 min
  message: {
    success: false,
    message: 'Too many login attempts. Please wait 15 minutes before trying again.',
  },
});
app.use('/api/auth/login', authLimiter);

const serveUploadHandler = (req, res) => {
  const reqFile = req.params.filename || req.params[0] || '';
  const cleanName = path.basename(reqFile);
  const found = findUploadedFile(cleanName, customUploadsDir);

  if (found) {
    res.setHeader('Cache-Control', 'public, max-age=86400');
    return res.sendFile(found);
  }

  // File not found — return 404 text response so frontend onError handles it cleanly.
  // NEVER send wide brand logo as an image payload that blows up into "NE" on mobile viewports!
  return res.status(404).send('Image not found');
};

app.get('/uploads/:filename(*)', serveUploadHandler);
app.get('/assets/uploads/:filename(*)', serveUploadHandler);

// Map /images/divisions to public assets
const divisionImageMap = {
  'general-medicine.jpg': '/assets/therapeutic-general-medicine.jpg',
  'ortheon.jpg': '/assets/ortheon.jpg',
  'orthopaedics.jpg': '/assets/ortheon.jpg',
  'womens-health.jpg': '/assets/therapeutic-womens-health.jpg',
  'pediaplus.jpg': '/assets/pediaplus.jpg',
  'pediatrics.jpg': '/assets/pediaplus.jpg',
  'paediatrics.jpg': '/assets/pediaplus.jpg',
  'neurix.jpg': '/assets/neurix.jpg',
  'neurology.jpg': '/assets/neurix.jpg',
  'eyerix.jpg': '/assets/eyerix.jpg',
  'ophthalmology.jpg': '/assets/eyerix.jpg',
  'vellis.webp': '/assets/vellis.webp',
  'dermatology.jpg': '/assets/vellis.webp',
  'otira.jpg': '/assets/otira.jpg',
  'ent.jpg': '/assets/otira.jpg',
  'cytos.jpg': '/assets/cytos.jpg',
  'oncology.jpg': '/assets/cytos.jpg',
};
app.use('/images/divisions/:filename', (req, res, next) => {
  const target = divisionImageMap[req.params.filename];
  if (target) {
    return res.redirect(target);
  }
  next();
});

// Public assets & fallback placeholder
const publicAssetsDir = path.resolve(__dirname, '../public/assets');
if (fs.existsSync(publicAssetsDir)) {
  app.use('/assets', express.static(publicAssetsDir));
}
const placeholderPath = path.resolve(__dirname, '../public/placeholder.png');
if (fs.existsSync(placeholderPath)) {
  app.use('/placeholder.png', (req, res) => res.sendFile(placeholderPath));
}

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/admin', dashboardRoutes);
app.use('/api', contactsRoutes); // /api/contact & /api/admin/enquiries
app.use('/api/therapeutic-areas', therapeuticAreasRoutes);
app.use('/api/products', productsRoutes);
app.use('/api/news', newsRoutes);
app.use('/api/pages', pagesRoutes);
app.use('/api/admin/media', mediaRoutes);
app.use('/api/media', mediaRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/admin/users', adminUsersRoutes);

// Serve Frontend Static Files
const distPath = path.join(__dirname, '../dist');
if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));
  app.get('*', (req, res, next) => {
    // Strictly prevent HTML catch-all for missing API calls, uploads, or images
    if (
      req.path.startsWith('/api') ||
      req.path.startsWith('/uploads') ||
      req.path.startsWith('/assets') ||
      req.path.endsWith('.jpg') ||
      req.path.endsWith('.jpeg') ||
      req.path.endsWith('.png') ||
      req.path.endsWith('.webp') ||
      req.path.endsWith('.svg')
    ) {
      return res.status(404).send('Not found');
    }
    res.sendFile(path.join(distPath, 'index.html'));
  });
}

// Error Handling Middleware
app.use(errorHandler);

// Start Server
// Calling app.listen(PORT) without a fixed host string allows Node.js to:
// 1) Bind simultaneously to all interfaces (IPv4 and IPv6)
// 2) Bind correctly to Passenger/CloudLinux Unix Domain Sockets when PORT is a socket path
const server = app.listen(PORT, () => {
  console.log(`========================================`);
  console.log(` Onecore Pharma API Server Running      `);
  console.log(` Port / Socket: ${PORT}                 `);
  console.log(` Health:        /api/health             `);
  console.log(` HealthDB:      /api/health/db          `);
  console.log(` Environment:   ${process.env.NODE_ENV || 'development'} `);
  console.log(`========================================`);

  // Non-blocking database check
  testConnection(5000).catch((err) => {
    console.warn('⚠️ Background MySQL connection test failed:', err.message);
  });
});

server.on('error', (error) => {
  if (error.code === 'EADDRINUSE') {
    console.error(`❌ [Onecore] Port or socket ${PORT} is already in use by another process.`);
  } else {
    console.error('❌ [Onecore] Server startup error:', error);
  }
  process.exit(1);
});

// Graceful Shutdown on LiteSpeed / system signals
const handleShutdown = (signal) => {
  console.log(`\n🛑 [Onecore] Received ${signal}. Shutting down gracefully...`);
  server.close(() => {
    console.log('✅ [Onecore] HTTP server closed.');
    process.exit(0);
  });
  setTimeout(() => {
    console.error('⚠️ [Onecore] Forcing server exit after timeout.');
    process.exit(1);
  }, 5000).unref();
};

process.on('SIGTERM', () => handleShutdown('SIGTERM'));
process.on('SIGINT', () => handleShutdown('SIGINT'));

process.on('unhandledRejection', (reason, promise) => {
  console.error('⚠️ [Onecore] Unhandled Rejection at:', promise, 'reason:', reason);
});

process.on('uncaughtException', (err) => {
  console.error('❌ [Onecore] Uncaught Exception:', err);
});

export { app, server };
export default app;

