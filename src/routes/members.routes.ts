import { Router } from 'express';
import {
  getMembers,
  getMemberById,
  createMember,
  updateMember,
  deleteMember,
} from '../controllers/members.controller';
import { authenticate, authorize } from '../middleware/auth';

const router = Router();

/**
 * GET /api/members
 * جلب جميع الأعضاء (مع pagination، search، filter)
 * الصلاحيات: ADMIN, TREASURER, BOARD_MEMBER
 */
router.get(
  '/',
  authenticate,
  authorize('ADMIN', 'TREASURER', 'BOARD_MEMBER'),
  getMembers
);

/**
 * GET /api/members/:id
 * جلب تفاصيل عضو واحد
 * الصلاحيات: ADMIN, TREASURER, BOARD_MEMBER
 */
router.get(
  '/:id',
  authenticate,
  authorize('ADMIN', 'TREASURER', 'BOARD_MEMBER'),
  getMemberById
);

/**
 * POST /api/members
 * إنشاء عضو جديد
 * الصلاحيات: ADMIN فقط
 */
router.post(
  '/',
  authenticate,
  authorize('ADMIN'),
  createMember
);

/**
 * PUT /api/members/:id
 * تحديث بيانات عضو
 * الصلاحيات: ADMIN فقط
 */
router.put(
  '/:id',
  authenticate,
  authorize('ADMIN'),
  updateMember
);

/**
 * DELETE /api/members/:id
 * حذف عضو
 * الصلاحيات: ADMIN فقط
 */
router.delete(
  '/:id',
  authenticate,
  authorize('ADMIN'),
  deleteMember
);

export default router;
