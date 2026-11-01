import { redirect } from 'next/navigation';
import { getAdminSession } from '@/lib/auth';
import { DashboardClient } from '@/components/dashboard/DashboardClient';

export const instant = false;

export const metadata = {
  title: 'Admin Dashboard — B Sunny Portfolio',
  robots: {
    index: false,
    follow: false,
  },
};

export default async function DashboardPage() {
  const session = await getAdminSession();

  if (!session) {
    redirect('/login');
  }

  return <DashboardClient adminEmail={session.email} />;
}
