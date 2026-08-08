import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const subscribers = [
  { email: 'guest@example.com', status: 'Active' },
  { email: 'partner@example.com', status: 'Pending' },
];

export function SubscribersPage() {
  return (
    <div className="space-y-4">
      {subscribers.map((subscriber) => (
        <Card key={subscriber.email} className="border-slate-200">
          <CardHeader>
            <CardTitle>{subscriber.email}</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-slate-600">
            <p>{subscriber.status}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
