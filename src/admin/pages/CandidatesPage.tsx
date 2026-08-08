import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { adminApplications } from '../data';

export function CandidatesPage() {
  return (
    <div className="space-y-4">
      {adminApplications.map((application) => (
        <Card key={application.id} className="border-slate-200">
          <CardHeader className="flex flex-row items-start justify-between gap-4">
            <div>
              <CardTitle className="text-lg">{application.candidate}</CardTitle>
              <p className="mt-1 text-sm text-slate-500">{application.role}</p>
            </div>
            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium uppercase tracking-wide text-slate-700">
              {application.stage}
            </span>
          </CardHeader>
          <CardContent className="flex flex-wrap items-center justify-between gap-4 text-sm text-slate-600">
            <p>Score: {application.score}/100</p>
            <p>Submitted {application.submitted}</p>
            <button className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100">
              View profile
            </button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
