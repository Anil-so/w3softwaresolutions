import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const locations = [
  { city: 'London', type: 'Office' },
  { city: 'Remote', type: 'Remote' },
  { city: 'Manchester', type: 'Hybrid' },
];

export function LocationsPage() {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      {locations.map((location) => (
        <Card key={location.city} className="border-slate-200">
          <CardHeader>
            <CardTitle>{location.city}</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-slate-600">
            <p>{location.type}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
