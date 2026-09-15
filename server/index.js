import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

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

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure uploads folder exists
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const app = express();
const PORT = process.env.PORT || 5000;

// Security & Middlewares
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' },
}));

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

// Static uploads serving
app.use('/uploads', express.static(uploadsDir));

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'Onecore Pharma API',
    timestamp: new Date().toISOString(),
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/admin', dashboardRoutes);
app.use('/api', contactsRoutes); // /api/contact & /api/admin/enquiries
app.use('/api/therapeutic-areas', therapeuticAreasRoutes);
app.use('/api/products', productsRoutes);
app.use('/api/news', newsRoutes);
app.use('/api/pages', pagesRoutes);
app.use('/api/admin/media', mediaRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/admin/users', adminUsersRoutes);

// Error Handling Middleware
app.use(errorHandler);

// Start Server
app.listen(PORT, async () => {
  console.log(`========================================`);
  console.log(` Onecore Pharma API Server Running      `);
  console.log(` Port:    http://localhost:${PORT}      `);
  console.log(` Health:  http://localhost:${PORT}/api/health `);
  console.log(` Environment: ${process.env.NODE_ENV || 'development'} `);
  console.log(`========================================`);

  // Verify MySQL connection
  await testConnection();
});
