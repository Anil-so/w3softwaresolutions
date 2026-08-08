import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function StatisticsPage() {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {[
        { label: 'Visitors', value: '12.4K' },
        { label: 'Applications', value: '218' },
        { label: 'Interviews', value: '34' },
        { label: 'Hires', value: '9' },
      ].map((stat) => (
        <Card key={stat.label} className="border-slate-200">
          <CardHeader>
            <CardTitle>{stat.label}</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-semibold text-slate-900">{stat.value}</CardContent>
        </Card>
      ))}
    </div>
  );
}
