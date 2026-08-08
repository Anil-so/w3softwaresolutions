import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export function CareerPageSettings() {
  return (
    <div className="space-y-4">
      <Card className="border-slate-200">
        <CardHeader>
          <CardTitle>Careers page content</CardTitle>
          <CardDescription>Edit job listings, salary, experience, locations, application fee, and hiring status.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-slate-600">
          <div className="rounded-xl border border-slate-200 p-4">
            <p className="font-medium text-slate-900">Job listings</p>
            <p className="mt-1">Senior React Developer, Product Designer, Backend Engineer.</p>
          </div>
          <div className="rounded-xl border border-slate-200 p-4">
            <p className="font-medium text-slate-900">Hiring controls</p>
            <p className="mt-1">Pause hiring, close hiring, and update application fee from one place.</p>
          </div>
          <Button>Save career settings</Button>
        </CardContent>
      </Card>
    </div>
  );
}
