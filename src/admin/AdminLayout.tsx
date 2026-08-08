import { Link, NavLink, Navigate, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, LogOut, BriefcaseBusiness, FileText, CreditCard, Users, Settings, CalendarDays, Building2, Mail, Newspaper, Megaphone, SlidersHorizontal, BarChart3, ContactRound, CircleDollarSign } from 'lucide-react';
import { adminNavItems } from './data';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { getAdminSession, signOutAdmin, isAdminAuthenticated } from './auth';

const iconMap = {
  '/admin/dashboard': LayoutDashboard,
  '/admin/jobs': BriefcaseBusiness,
  '/admin/applications': FileText,
  '/admin/payments': CreditCard,
  '/admin/interviews': CalendarDays,
  '/admin/users': Users,
  '/admin/settings': Settings,
};

export function AdminLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const currentItem = adminNavItems.find((item) => item.href === location.pathname) ?? adminNavItems[0];
  const Icon = iconMap[location.pathname as keyof typeof iconMap] ?? LayoutDashboard;

  if (!isAdminAuthenticated()) {
    return <Navigate to="/admin/login" replace />;
  }

  const handleLogout = () => {
    signOutAdmin();
    navigate('/admin/login');
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <div className="flex min-h-screen flex-col lg:flex-row">
        <aside className="w-full border-b border-slate-200 bg-white/80 px-6 py-6 backdrop-blur lg:w-72 lg:border-b-0 lg:border-r">
          <div className="mb-8">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-500">W3 Admin</p>
            <h2 className="mt-2 text-2xl font-semibold text-slate-900">Recruitment Hub</h2>
          </div>

          <nav className="space-y-2">
            {adminNavItems.map((item) => {
              const active = location.pathname === item.href;
              const ItemIcon = iconMap[item.href as keyof typeof iconMap] ?? LayoutDashboard;

              return (
                <NavLink
                  key={item.href}
                  to={item.href}
                  className={cn(
                    'flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition',
                    active ? 'bg-slate-900 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  )}
                >
                  <ItemIcon className="h-4 w-4" />
                  <span>{item.title}</span>
                </NavLink>
              );
            })}
          </nav>

          <div className="mt-8 rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-sm font-medium text-slate-700">Signed in as</p>
            <p className="mt-1 font-semibold text-slate-900">Admin Portal</p>
            <p className="mt-1 text-sm text-slate-500">Secure recruitment operations</p>
          </div>
        </aside>

        <main className="flex-1 p-6 lg:p-10">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-sm font-medium text-slate-500">
                <Icon className="h-4 w-4" />
                <span>{currentItem?.title}</span>
              </div>
              <h1 className="mt-1 text-3xl font-semibold text-slate-900">{currentItem?.title}</h1>
              <p className="mt-2 text-sm text-slate-600">{currentItem?.description}</p>
            </div>

            <div className="flex items-center gap-3">
              <Button asChild variant="outline" className="border-slate-300 bg-white">
                <Link to="/">Back to site</Link>
              </Button>
              <Button onClick={handleLogout} variant="ghost" className="text-slate-600 hover:bg-slate-100 hover:text-slate-900">
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </Button>
            </div>
          </div>

          <Outlet />
        </main>
      </div>
    </div>
  );
}
