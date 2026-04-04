import { useGetAllDepositRequests, useVerifyPayment } from '../hooks/useQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Loader2, CheckCircle, XCircle, Clock, Shield } from 'lucide-react';
import { toast } from 'sonner';
import { PaymentStatus } from '../backend';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../components/ui/table';

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

export default function AdminDashboard() {
  const [adminPassword, setAdminPassword] = useState('');
  const [isUnlocked, setIsUnlocked] = useState(false);
  const { data: requests, isLoading } = useGetAllDepositRequests();
  const verifyPayment = useVerifyPayment();
  const ADMIN_PANEL_PASSWORD = '@Vivek829465';

  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminPassword !== ADMIN_PANEL_PASSWORD) {
      toast.error('गलत एडमिन पासवर्ड');
      return;
    }
    setIsUnlocked(true);
    toast.success('एडमिन पैनल अनलॉक हो गया');
  };

  const handleVerify = async (requestId: string, status: PaymentStatus) => {
    try {
      await verifyPayment.mutateAsync({ requestId, status });
      toast.success(
        status === PaymentStatus.verified ? 'पेमेंट वेरिफाई हो गया!' : 'पेमेंट रिजेक्ट हो गया!'
      );
    } catch (error) {
      toast.error('वेरिफिकेशन में त्रुटि');
      console.error(error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  const sortedRequests = [...(requests || [])].sort((a, b) => Number(b.timestamp - a.timestamp));

  if (!isUnlocked) {
    return (
      <div className="max-w-md mx-auto">
        <Card className="shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-purple-600" />
              एडमिन पैनल लॉगिन
            </CardTitle>
            <CardDescription>एडमिन पासवर्ड डालकर डिपॉजिट वेरिफिकेशन खोलें</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleUnlock} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="admin-password">एडमिन पासवर्ड</Label>
                <Input
                  id="admin-password"
                  type="password"
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  placeholder="पासवर्ड दर्ज करें"
                  required
                />
              </div>
              <Button type="submit" className="w-full">
                एडमिन पैनल खोलें
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <Shield className="w-8 h-8 text-purple-600" />
          <h2 className="text-3xl font-bold">एडमिन पैनल</h2>
        </div>
        <p className="text-muted-foreground">सभी डिपॉजिट रिक्वेस्ट को मैनेज करें</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>डिपॉजिट रिक्वेस्ट</CardTitle>
          <CardDescription>
            कुल {sortedRequests.length} रिक्वेस्ट
          </CardDescription>
        </CardHeader>
        <CardContent>
          {sortedRequests.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Clock className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>कोई रिक्वेस्ट नहीं है</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>यूजर</TableHead>
                    <TableHead>राशि</TableHead>
                    <TableHead>पेमेंट मेथड</TableHead>
                    <TableHead>UTR</TableHead>
                    <TableHead>स्टेटस</TableHead>
                    <TableHead>समय</TableHead>
                    <TableHead className="text-right">एक्शन</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sortedRequests.map((request) => (
                    <TableRow key={request.timestamp.toString()}>
                      <TableCell className="font-mono text-xs">
                        {request.user.toString().slice(0, 8)}...
                      </TableCell>
                      <TableCell className="font-semibold">
                        ₹{Number(request.amount).toLocaleString('en-IN')}
                      </TableCell>
                      <TableCell>
                        {paymentMethodLabels[request.paymentMethod]}
                      </TableCell>
                      <TableCell>
                        {request.utr ? (
                          <code className="text-xs bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
                            {request.utr}
                          </code>
                        ) : (
                          <span className="text-muted-foreground text-xs">-</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge className={statusColors[request.status]}>
                          {statusLabels[request.status]}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground">
                        {new Date(Number(request.timestamp) / 1000000).toLocaleString('hi-IN')}
                      </TableCell>
                      <TableCell className="text-right">
                        {request.status === PaymentStatus.pending && request.utr && (
                          <div className="flex gap-2 justify-end">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleVerify(request.timestamp.toString(), PaymentStatus.verified)}
                              disabled={verifyPayment.isPending}
                              className="gap-1"
                            >
                              <CheckCircle className="w-3 h-3" />
                              वेरिफाई
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleVerify(request.timestamp.toString(), PaymentStatus.failed)}
                              disabled={verifyPayment.isPending}
                              className="gap-1 text-destructive"
                            >
                              <XCircle className="w-3 h-3" />
                              रिजेक्ट
                            </Button>
                          </div>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
