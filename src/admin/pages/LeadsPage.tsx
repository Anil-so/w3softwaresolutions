import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const leads = [
  { name: 'Mia Walker', email: 'mia@example.com', topic: 'Custom software' },
  { name: 'Noah Diaz', email: 'noah@example.com', topic: 'Careers enquiry' },
];

export function LeadsPage() {
  return (
    <div className="space-y-4">
      {leads.map((lead) => (
        <Card key={lead.email} className="border-slate-200">
          <CardHeader>
            <CardTitle>{lead.name}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-slate-600">
            <p>{lead.email}</p>
            <p>{lead.topic}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
