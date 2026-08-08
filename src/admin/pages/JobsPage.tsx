import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { adminJobs } from '../data';

export function JobsPage() {
  return (
    <div className="space-y-4">
      {adminJobs.map((job) => (
        <Card key={job.id} className="border-slate-200">
          <CardHeader className="flex flex-row items-start justify-between gap-4">
            <div>
              <CardTitle className="text-lg">{job.title}</CardTitle>
              <p className="mt-1 text-sm text-slate-500">{job.location} • {job.type}</p>
            </div>
            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium uppercase tracking-wide text-slate-700">
              {job.status}
            </span>
          </CardHeader>
          <CardContent className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex gap-3 text-sm text-slate-600">
              <span className="rounded-full bg-emerald-50 px-3 py-1 text-emerald-700">{job.priority}</span>
              <span>{job.applicants} applicants</span>
            </div>
            <button className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100">
              Manage role
            </button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
