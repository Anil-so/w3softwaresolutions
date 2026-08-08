import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export function SettingsPage() {
  return (
    <div className="space-y-4">
      <Card className="border-slate-200">
        <CardHeader>
          <CardTitle>Recruitment preferences</CardTitle>
          <CardDescription>Manage notifications, automations, and access controls for the admin workspace.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="rounded-xl border border-slate-200 p-4 text-sm text-slate-600">
            <p className="font-medium text-slate-900">Email alerts</p>
            <p className="mt-1">New applications and interview updates are enabled.</p>
          </div>
          <div className="rounded-xl border border-slate-200 p-4 text-sm text-slate-600">
            <p className="font-medium text-slate-900">Approval flow</p>
            <p className="mt-1">Recruiters can review candidates before final sign-off.</p>
          </div>
          <Button className="mt-2">Save settings</Button>
        </CardContent>
      </Card>
    </div>
  );
}
