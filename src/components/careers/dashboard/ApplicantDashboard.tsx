import { ArrowRight, Briefcase, CreditCard, FileText, LayoutDashboard, LogOut, ShieldCheck, UserCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

const sidebarItems = [
  { label: 'Dashboard', icon: LayoutDashboard },
  { label: 'My Applications', icon: Briefcase },
  { label: 'Payment History', icon: CreditCard },
  { label: 'Documents', icon: FileText },
  { label: 'Profile', icon: UserCircle2 },
];

export function ApplicantDashboard() {
  return (
    <div className="grid gap-6 lg:grid-cols-[260px_1fr]">
      <aside className="rounded-[28px] border border-slate-200 bg-slate-950 p-4 text-white shadow-[0_30px_80px_-30px_rgba(15,23,42,0.45)]">
        <div className="mb-6 rounded-2xl border border-white/10 bg-white/10 p-4">
          <p className="text-sm font-medium uppercase tracking-[0.25em] text-slate-300">Applicant portal</p>
          <h3 className="mt-2 text-xl font-semibold">Welcome back</h3>
        </div>
        <nav className="space-y-2">
          {sidebarItems.map((item) => {
            const Icon = item.icon;
            return (
              <button key={item.label} className="flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-left text-sm font-medium text-slate-300 transition hover:bg-white/10 hover:text-white">
                <Icon className="h-4 w-4" />
                {item.label}
              </button>
            );
          })}
        </nav>
        <div className="mt-6 rounded-2xl border border-white/10 bg-white/10 p-4">
          <Button variant="secondary" className="w-full rounded-2xl bg-white text-slate-900 hover:bg-slate-100">
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>
      </aside>
      <div className="space-y-6">
        <Card className="border-slate-200 bg-white/90 shadow-[0_30px_80px_-30px_rgba(15,23,42,0.2)]">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-slate-900">Application overview</CardTitle>
            <CardDescription className="text-sm text-slate-600">Everything you need to track your candidate journey in one place.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-sm text-slate-500">Profile completion</p>
              <p className="mt-3 text-3xl font-semibold text-slate-900">84%</p>
              <Progress value={84} className="mt-3" />
            </div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-sm text-slate-500">Application status</p>
              <p className="mt-3 text-3xl font-semibold text-slate-900">Under Review</p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-sm text-slate-500">Payment status</p>
              <p className="mt-3 text-3xl font-semibold text-slate-900">Verified</p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-sm text-slate-500">Resume status</p>
              <p className="mt-3 text-3xl font-semibold text-slate-900">Ready</p>
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
          <Card className="border-slate-200 bg-white/90 shadow-[0_30px_80px_-30px_rgba(15,23,42,0.2)]">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-slate-900">Upcoming interviews</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {[{ title: 'Recruiter screening', time: '08 Aug • 10:30 AM' }, { title: 'Technical discussion', time: '10 Aug • 02:00 PM' }].map((item) => (
                <div key={item.title} className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <div>
                    <p className="font-medium text-slate-900">{item.title}</p>
                    <p className="text-sm text-slate-500">{item.time}</p>
                  </div>
                  <div className="flex items-center gap-2 text-slate-700">
                    <ShieldCheck className="h-4 w-4" />
                    Scheduled
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
          <Card className="border-slate-200 bg-white/90 shadow-[0_30px_80px_-30px_rgba(15,23,42,0.2)]">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-slate-900">Next step</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
                Our team will review your documents and share the next action plan within 24–48 hours.
              </div>
              <Button className="w-full rounded-2xl">
                Continue to interviews
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
