import { Request, Response } from 'express';
import { generateToken, JwtPayload } from '../utils/jwt';
import { AuthRequest } from '../middleware/auth';

// Mock database - استبدل بـ Prisma في الإنتاج
const mockUsers = [
  {
    id: '1',
    email: 'admin@associa.ma',
    password: 'admin123',
    name: 'مدير النظام',
    role: 'ADMIN',
  },
  {
    id: '2',
    email: 'user@associa.ma',
    password: 'user123',
    name: 'مستخدم عادي',
    role: 'USER',
  },
];

export async function login(req: Request, res: Response): Promise<void> {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({
        success: false,
        message: 'البريد الإلكتروني وكلمة المرور مطلوبان',
      });
      return;
    }

    const user = mockUsers.find(
      (u) => u.email === email && u.password === password
    );

    if (!user) {
      res.status(401).json({
        success: false,
        message: 'البريد الإلكتروني أو كلمة المرور غير صحيحة',
      });
      return;
    }

    const payload: JwtPayload = {
      userId: user.id,
      email: user.email,
      role: user.role,
    };

    const token = generateToken(payload);

    res.status(200).json({
      success: true,
      message: 'تم تسجيل الدخول بنجاح',
      data: {
        token,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        },
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'خطأ في الخادم',
    });
  }
}

export async function getMe(req: AuthRequest, res: Response): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'غير مصرح: يرجى تسجيل الدخول أولاً',
      });
      return;
    }

    const user = mockUsers.find((u) => u.id === req.user!.userId);

    if (!user) {
      res.status(404).json({
        success: false,
        message: 'المستخدم غير موجود',
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'خطأ في الخادم',
    });
  }
}
