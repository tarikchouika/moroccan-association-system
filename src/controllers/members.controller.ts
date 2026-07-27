import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// أنواع العضوية والحالة — تطابق enums في Prisma schema
type MembershipType = 'active' | 'honorary' | 'student' | 'benefactor';
type MemberStatus = 'active' | 'pending' | 'suspended';

/**
 * GET /api/members
 * جلب جميع الأعضاء مع pagination و search و filter
 */
export async function getMembers(req: Request, res: Response): Promise<void> {
  try {
    const page = Math.max(1, parseInt(req.query.page as string) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit as string) || 20));
    const search = (req.query.search as string) || '';
    const status = req.query.status as MemberStatus | undefined;
    const membershipType = req.query.membershipType as MembershipType | undefined;
    const skip = (page - 1) * limit;

    // بناء شروط البحث والتصفية
    const where: Record<string, any> = {};

    if (search) {
      where.OR = [
        { firstName: { contains: search, mode: 'insensitive' } },
        { lastName: { contains: search, mode: 'insensitive' } },
        { membershipNumber: { contains: search, mode: 'insensitive' } },
        { nationalId: { contains: search, mode: 'insensitive' } },
        { city: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (status) {
      where.status = status;
    }

    if (membershipType) {
      where.membershipType = membershipType;
    }

    const [members, total] = await Promise.all([
      prisma.member.findMany({
        where,
        skip,
        take: limit,
        orderBy: { joinedDate: 'desc' },
        include: {
          user: {
            select: { email: true },
          },
          subscriptions: {
            where: { status: 'active' },
            take: 1,
            orderBy: { startDate: 'desc' },
            include: { subscriptionType: true },
          },
        },
      }),
      prisma.member.count({ where }),
    ]);

    res.status(200).json({
      success: true,
      data: members,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('خطأ في جلب الأعضاء:', error);
    res.status(500).json({
      success: false,
      message: 'خطأ في الخادم أثناء جلب الأعضاء',
    });
  }
}

/**
 * GET /api/members/:id
 * جلب عضو واحد بالمعرف مع تفاصيله الكاملة
 */
export async function getMemberById(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params;

    const member = await prisma.member.findUnique({
      where: { id },
      include: {
        user: {
          select: { email: true },
        },
        subscriptions: {
          include: { subscriptionType: true },
          orderBy: { startDate: 'desc' },
        },
        boardMemberships: {
          include: { position: true },
        },
      },
    });

    if (!member) {
      res.status(404).json({
        success: false,
        message: 'العضو غير موجود',
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: member,
    });
  } catch (error) {
    console.error('خطأ في جلب العضو:', error);
    res.status(500).json({
      success: false,
      message: 'خطأ في الخادم أثناء جلب بيانات العضو',
    });
  }
}

/**
 * POST /api/members
 * إنشاء عضو جديد مع توليد رقم العضوية تلقائياً
 * الصيغة: MEM-YYYY-NNNN (مثال: MEM-2026-0001)
 */
export async function createMember(req: Request, res: Response): Promise<void> {
  try {
    const {
      firstName,
      lastName,
      nationalId,
      dateOfBirth,
      address,
      city,
      profession,
      membershipType,
      cndpConsent,
    } = req.body;

    // التحقق من الحقول المطلوبة
    if (!firstName || !lastName) {
      res.status(400).json({
        success: false,
        message: 'الاسم الأول والاسم الأخير مطلوبان',
      });
      return;
    }

    // توليد رقم العضوية: MEM-YYYY-NNNN
    const currentYear = new Date().getFullYear();

    // البحث عن آخر رقم عضوية في نفس السنة
    const lastMember = await prisma.member.findFirst({
      where: {
        membershipNumber: { startsWith: `MEM-${currentYear}-` },
      },
      orderBy: { membershipNumber: 'desc' },
    });

    let nextNumber = 1;
    if (lastMember) {
      const lastNum = parseInt(lastMember.membershipNumber.split('-').pop() || '0', 10);
      nextNumber = lastNum + 1;
    }

    const membershipNumber = `MEM-${currentYear}-${String(nextNumber).padStart(4, '0')}`;

    // التحقق من عدم تكرار الرقم الوطني
    if (nationalId) {
      const existingNationalId = await prisma.member.findFirst({
        where: { nationalId },
      });

      if (existingNationalId) {
        res.status(409).json({
          success: false,
          message: 'الرقم الوطني مسجل مسبقاً لعضو آخر',
        });
        return;
      }
    }

    const member = await prisma.member.create({
      data: {
        membershipNumber,
        firstName,
        lastName,
        nationalId: nationalId || null,
        dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : null,
        address: address || null,
        city: city || null,
        profession: profession || null,
        membershipType: membershipType || 'active',
        joinedDate: new Date(),
        cndpConsent: cndpConsent || false,
        cndpConsentDate: cndpConsent ? new Date() : null,
      },
    });

    res.status(201).json({
      success: true,
      message: 'تم إنشاء العضو بنجاح',
      data: member,
    });
  } catch (error) {
    console.error('خطأ في إنشاء العضو:', error);
    res.status(500).json({
      success: false,
      message: 'خطأ في الخادم أثناء إنشاء العضو',
    });
  }
}

/**
 * PUT /api/members/:id
 * تحديث بيانات عضو
 */
export async function updateMember(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params;

    // التأكد من وجود العضو
    const existingMember = await prisma.member.findUnique({ where: { id } });

    if (!existingMember) {
      res.status(404).json({
        success: false,
        message: 'العضو غير موجود',
      });
      return;
    }

    const {
      firstName,
      lastName,
      nationalId,
      dateOfBirth,
      address,
      city,
      profession,
      membershipType,
      status,
      notes,
      cndpConsent,
    } = req.body;

    // التحقق من عدم تكرار الرقم الوطني إذا تم تغييره
    if (nationalId && nationalId !== existingMember.nationalId) {
      const duplicateNationalId = await prisma.member.findFirst({
        where: { nationalId, id: { not: id } },
      });

      if (duplicateNationalId) {
        res.status(409).json({
          success: false,
          message: 'الرقم الوطني مسجل مسبقاً لعضو آخر',
        });
        return;
      }
    }

    const member = await prisma.member.update({
      where: { id },
      data: {
        ...(firstName !== undefined && { firstName }),
        ...(lastName !== undefined && { lastName }),
        ...(nationalId !== undefined && { nationalId }),
        ...(dateOfBirth !== undefined && {
          dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : null,
        }),
        ...(address !== undefined && { address }),
        ...(city !== undefined && { city }),
        ...(profession !== undefined && { profession }),
        ...(membershipType !== undefined && { membershipType }),
        ...(status !== undefined && { status }),
        ...(notes !== undefined && { notes }),
        ...(cndpConsent !== undefined && {
          cndpConsent,
          cndpConsentDate: cndpConsent && !existingMember.cndpConsent
            ? new Date()
            : existingMember.cndpConsentDate,
        }),
      },
    });

    res.status(200).json({
      success: true,
      message: 'تم تحديث بيانات العضو بنجاح',
      data: member,
    });
  } catch (error) {
    console.error('خطأ في تحديث العضو:', error);
    res.status(500).json({
      success: false,
      message: 'خطأ في الخادم أثناء تحديث بيانات العضو',
    });
  }
}

/**
 * DELETE /api/members/:id
 * حذف عضو
 */
export async function deleteMember(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params;

    const existingMember = await prisma.member.findUnique({ where: { id } });

    if (!existingMember) {
      res.status(404).json({
        success: false,
        message: 'العضو غير موجود',
      });
      return;
    }

    await prisma.member.delete({ where: { id } });

    res.status(200).json({
      success: true,
      message: 'تم حذف العضو بنجاح',
    });
  } catch (error) {
    console.error('خطأ في حذف العضو:', error);
    res.status(500).json({
      success: false,
      message: 'خطأ في الخادم أثناء حذف العضو',
    });
  }
}
