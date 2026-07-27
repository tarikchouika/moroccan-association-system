import { Router } from 'express';
import { login, getMe } from '../controllers/auth.controller';
import { authenticate, authorize } from '../middleware/auth';

const router = Router();

// POST /api/auth/login - تسجيل الدخول
router.post('/login', login);

// GET /api/auth/me - الحصول على معلومات المستخدم الحالي
router.get('/me', authenticate, getMe);

// GET /api/auth/admin-only - مثال على مسار محمي بالصلاحيات
router.get('/admin-only', authenticate, authorize('ADMIN'), (req, res) => {
  res.status(200).json({
    success: true,
    message: 'مرحباً بك في المسار الإداري',
    data: {
      user: req.user,
    },
  });
});

export default router;
