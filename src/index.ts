import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth.routes';
import membersRoutes from './routes/members.routes';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health Check Endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'الخادم يعمل بنجاح',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/members', membersRoutes);

// Root Route
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'مرحباً بك في نظام إدارة الجمعيات المغربية - AssociaMA',
    version: '1.0.0',
    endpoints: {
      health: '/health',
      auth: {
        login: 'POST /api/auth/login',
        me: 'GET /api/auth/me',
        adminOnly: 'GET /api/auth/admin-only',
      },
      members: {
        list: 'GET /api/members',
        getById: 'GET /api/members/:id',
        create: 'POST /api/members',
        update: 'PUT /api/members/:id',
        delete: 'DELETE /api/members/:id',
      },
    },
  });
});

// 404 Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'المسار غير موجود',
  });
});

// Global Error Handler
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('خطأ غير متوقع:', err);
  res.status(500).json({
    success: false,
    message: 'خطأ داخلي في الخادم',
  });
});

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 الخادم يعمل على المنفذ ${PORT}`);
  console.log(`📦 Health Check: http://localhost:${PORT}/health`);
  console.log(`🔐 Auth Routes: http://localhost:${PORT}/api/auth`);
});

export default app;
