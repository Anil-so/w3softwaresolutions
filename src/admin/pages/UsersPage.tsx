import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { adminUsers } from '../data';

export function UsersPage() {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {adminUsers.map((user) => (
        <Card key={user.id} className="border-slate-200">
          <CardHeader>
            <CardTitle className="text-lg">{user.name}</CardTitle>
            <p className="text-sm text-slate-500">{user.email}</p>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-slate-600">
            <p>{user.role}</p>
            <p className="font-medium text-slate-700">{user.status}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
