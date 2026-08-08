import { BriefcaseBusiness, FileText, Users, CreditCard, Sparkles } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { adminApplications, adminJobs, adminPayments } from '../data';

const metrics = [
  { title: 'Open roles', value: adminJobs.length.toString(), icon: BriefcaseBusiness, detail: '3 active positions' },
  { title: 'Applications', value: adminApplications.length.toString(), icon: FileText, detail: '91% average score' },
  { title: 'Payments', value: adminPayments.length.toString(), icon: CreditCard, detail: '2 pending invoices' },
  { title: 'Admin access', value: '1', icon: Users, detail: 'Single admin panel' },
];

export function DashboardPage() {
  return (
    <div className="space-y-6">
      <Card className="border-slate-200 bg-gradient-to-br from-slate-900 to-slate-700 text-white">
        <CardHeader>
          <div className="flex items-center gap-2 text-sm text-slate-300">
            <Sparkles className="h-4 w-4" />
            <span>Operations summary</span>
          </div>
          <CardTitle className="text-2xl">Recruitment pipeline is healthy</CardTitle>
          <CardDescription className="max-w-2xl text-slate-300">
            Review roles, applicants, interviews, and payments in one secure admin workspace.
          </CardDescription>
        </CardHeader>
      </Card>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {metrics.map((metric) => {
          const Icon = metric.icon;
          return (
            <Card key={metric.title} className="border-slate-200">
              <CardContent className="flex items-start justify-between p-5">
                <div>
                  <p className="text-sm text-slate-500">{metric.title}</p>
                  <p className="mt-2 text-3xl font-semibold text-slate-900">{metric.value}</p>
                  <p className="mt-2 text-sm text-slate-500">{metric.detail}</p>
                </div>
                <div className="rounded-xl bg-slate-100 p-3 text-slate-700">
                  <Icon className="h-5 w-5" />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
