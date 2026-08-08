import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { adminInterviews } from '../data';

export function InterviewsPage() {
  return (
    <div className="space-y-4">
      {adminInterviews.map((interview) => (
        <Card key={interview.id} className="border-slate-200">
          <CardHeader className="flex flex-row items-start justify-between gap-4">
            <div>
              <CardTitle className="text-lg">{interview.candidate}</CardTitle>
              <p className="mt-1 text-sm text-slate-500">{interview.role}</p>
            </div>
            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium uppercase tracking-wide text-slate-700">
              {interview.status}
            </span>
          </CardHeader>
          <CardContent className="flex flex-wrap items-center justify-between gap-4 text-sm text-slate-600">
            <p>{interview.time}</p>
            <p>{interview.interviewer}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
