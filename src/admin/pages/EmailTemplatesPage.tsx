import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export function EmailTemplatesPage() {
  return (
    <div className="space-y-4">
      <Card className="border-slate-200">
        <CardHeader>
          <CardTitle>Interview invite email</CardTitle>
          <CardDescription>Template for scheduling interviews and follow-ups.</CardDescription>
        </CardHeader>
        <CardContent className="text-sm text-slate-600">
          <p>Hi {{candidate_name}}, thank you for your interest in W3 Software Solutions.</p>
        </CardContent>
      </Card>
    </div>
  );
}
