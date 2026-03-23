import { useGetCallerDepositRequests } from '../hooks/useQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Loader2, Clock } from 'lucide-react';

const paymentMethodLabels = {
  phonePe: 'PhonePe',
  googlePay: 'Google Pay',
  paytm: 'Paytm',
  bhim: 'BHIM',
};

const statusLabels = {
  pending: 'पेंडिंग',
  verified: 'वेरिफाइड',
  failed: 'फेल',
};

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
  verified: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  failed: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
};

export default function DepositHistory() {
  const { data: requests, isLoading } = useGetCallerDepositRequests();

  if (isLoading) {
    return (
      <Card className="shadow-xl">
        <CardContent className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </CardContent>
      </Card>
    );
  }

  const sortedRequests = [...(requests || [])].sort((a, b) => Number(b.timestamp - a.timestamp));

  return (
    <Card className="shadow-xl">
      <CardHeader>
        <CardTitle className="text-2xl">डिपॉजिट हिस्ट्री</CardTitle>
        <CardDescription>आपके सभी ट्रांजैक्शन</CardDescription>
      </CardHeader>
      <CardContent>
        {sortedRequests.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <Clock className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>कोई ट्रांजैक्शन नहीं है</p>
          </div>
        ) : (
          <div className="space-y-4">
            {sortedRequests.map((request) => (
              <div
                key={request.timestamp.toString()}
                className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="text-2xl font-bold text-primary">
                      ₹{Number(request.amount).toLocaleString('en-IN')}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {paymentMethodLabels[request.paymentMethod]}
                    </p>
                  </div>
                  <Badge className={statusColors[request.status]}>
                    {statusLabels[request.status]}
                  </Badge>
                </div>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">समय:</span>
                    <span className="font-medium">
                      {new Date(Number(request.timestamp) / 1000000).toLocaleString('hi-IN')}
                    </span>
                  </div>
                  {request.utr && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">UTR:</span>
                      <code className="text-xs bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
                        {request.utr}
                      </code>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
