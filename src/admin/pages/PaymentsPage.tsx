import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { adminPayments } from '../data';

export function PaymentsPage() {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {adminPayments.map((payment) => (
        <Card key={payment.id} className="border-slate-200">
          <CardHeader>
            <CardTitle className="text-lg">{payment.client}</CardTitle>
            <p className="text-sm text-slate-500">{payment.date}</p>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-slate-600">
            <p className="text-2xl font-semibold text-slate-900">{payment.amount}</p>
            <p>{payment.method}</p>
            <p className="font-medium text-slate-700">{payment.status}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
