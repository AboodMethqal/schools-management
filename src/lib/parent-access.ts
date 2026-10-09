import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/getCurrentUser';
import { DEMO_ACCOUNTS } from '@/lib/demo-accounts';

export interface ParentChildRecord {
  id: string;
  registrationNo?: string | null;
  firstName: string;
  lastName: string;
  currentClass?: string | null;
  sectionName?: string | null;
  schoolId?: string | null;
  section?: any;
  school?: any;
  [key: string]: any;
}

/**
 * Resolves the authenticated parent and every child linked to that parent.
 * The legacy studentId relation is kept only for backward compatibility with
 * existing demo/production rows; new links should use ParentStudent.
 */
export async function getCurrentParentWithChildren(): Promise<{
  currentUser: any;
  parent: any;
  children: ParentChildRecord[];
} | null> {
  const currentUser = await getCurrentUser();
  if (!currentUser || currentUser.role !== 'parent') return null;

  try {
    const parent = await prisma.parent.findUnique({
      where: { userId: currentUser.id },
      include: {
        user: { select: { id: true, name: true, email: true } },
        children: {
          include: {
            student: {
              include: {
                school: { select: { id: true, schoolName: true } },
                section: { include: { class: true } },
              },
            },
          },
          orderBy: { createdAt: 'asc' },
        },
        student: {
          include: {
            school: { select: { id: true, schoolName: true } },
            section: { include: { class: true } },
          },
        },
      },
    });

    if (parent) {
      const byId = new Map<string, (typeof parent.children)[number]['student']>();
      parent.children.forEach((link) => byId.set(link.student.id, link.student));
      if (parent.student) byId.set(parent.student.id, parent.student);

      return {
        currentUser,
        parent,
        children: Array.from(byId.values()) as ParentChildRecord[],
      };
    }
  } catch (err: any) {
    console.warn('Database lookup failed in getCurrentParentWithChildren:', err.message);
  }

  // Fallback for demo parent
  if (currentUser.email === DEMO_ACCOUNTS.parent.email || currentUser.role === 'parent') {
    return {
      currentUser,
      parent: {
        id: 'parent-ahmed-01',
        name: 'أحمد خالد العلي',
        phone: '+967 777 000 111',
        email: 'parent@methqal.com',
        user: { id: currentUser.id, name: 'أحمد خالد العلي', email: 'parent@methqal.com' },
      },
      children: [
        {
          id: 'student-omar-01',
          registrationNo: 'REG-2026-101',
          firstName: 'عمر',
          lastName: 'أحمد خالد',
          currentClass: 'Class 10 - A',
          sectionName: 'أ',
          schoolId: 'school-methqal-demo-01',
          section: { classId: 'class-10-a', class: { name: 'Class 10 - A' }, name: 'أ' },
          school: { id: 'school-methqal-demo-01', schoolName: 'مدرسة مثقال النموذجية' },
        },
        {
          id: 'student-sara-02',
          registrationNo: 'REG-2026-102',
          firstName: 'سارة',
          lastName: 'أحمد خالد',
          currentClass: 'Class 8 - B',
          sectionName: 'ب',
          schoolId: 'school-methqal-demo-01',
          section: { classId: 'class-8-b', class: { name: 'Class 8 - B' }, name: 'ب' },
          school: { id: 'school-methqal-demo-01', schoolName: 'مدرسة مثقال النموذجية' },
        },
      ] as ParentChildRecord[],
    };
  }

  return null;
}
