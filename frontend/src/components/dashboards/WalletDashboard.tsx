import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Wallet, TrendingUp, TrendingDown, Clock, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { useWalletStore } from '../../lib/walletStore';
import { toast } from 'sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';

export default function WalletDashboard() {
  const { totalBalance, verifiedBalance, pendingBalance, depositRewards, dailyRewards, referralRewards } = useWalletStore();
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [upiId, setUpiId] = useState('');
  const [isWithdrawing, setIsWithdrawing] = useState(false);
  const [withdrawals, setWithdrawals] = useState<Array<{
    id: string;
    amount: number;
    upiId: string;
    status: 'pending' | 'completed' | 'rejected';
    date: Date;
  }>>([]);

  const handleWithdraw = async (e: React.FormEvent) => {
    e.preventDefault();

    const amount = parseFloat(withdrawAmount);
    if (!amount || amount < 455 || amount > 10000) {
      toast.error('राशि ₹455 से ₹10,000 के बीच होनी चाहिए');
      return;
    }

    if (amount > verifiedBalance) {
      toast.error('अपर्याप्त वेरिफाइड बैलेंस');
      return;
    }

    if (!upiId || !upiId.includes('@')) {
      toast.error('कृपया सही UPI ID दर्ज करें');
      return;
    }

    const lastWithdrawal = withdrawals[0];
    if (lastWithdrawal) {
      const timeDiff = new Date().getTime() - lastWithdrawal.date.getTime();
      const hoursDiff = timeDiff / (1000 * 60 * 60);
      if (hoursDiff < 24) {
        toast.error('आप 24 घंटे में एक बार ही निकाल सकते हैं');
        return;
      }
    }

    setIsWithdrawing(true);

    setTimeout(() => {
      const newWithdrawal = {
        id: Date.now().toString(),
        amount,
        upiId,
        status: 'pending' as const,
        date: new Date(),
      };

      setWithdrawals([newWithdrawal, ...withdrawals]);
      setWithdrawAmount('');
      setUpiId('');
      setIsWithdrawing(false);
      toast.success('निकासी रिक्वेस्ट सबमिट हो गई! एडमिन वेरिफिकेशन का इंतजार करें');
    }, 1500);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400">
            <Clock className="w-3 h-3" />
            पेंडिंग
          </span>
        );
      case 'completed':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
            <CheckCircle className="w-3 h-3" />
            पूर्ण
          </span>
        );
      case 'rejected':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400">
            <XCircle className="w-3 h-3" />
            अस्वीकृत
          </span>
        );
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="text-center mb-6">
        <h2 className="text-3xl font-bold mb-2">मेरा वॉलेट</h2>
        <p className="text-muted-foreground">अपना बैलेंस देखें और पैसे निकालें</p>
      </div>

      <Card className="bg-gradient-to-br from-emerald-500 to-blue-600 text-white border-0 shadow-2xl">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Wallet className="w-6 h-6" />
            कुल बैलेंस
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-5xl font-bold mb-6">₹{totalBalance.toFixed(2)}</div>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white/20 rounded-lg p-4 backdrop-blur-sm">
              <div className="text-emerald-100 text-sm mb-1">वेरिफाइड बैलेंस</div>
              <div className="text-2xl font-bold">₹{verifiedBalance.toFixed(2)}</div>
              <div className="text-xs text-emerald-100 mt-1">निकासी के लिए उपलब्ध</div>
            </div>
            <div className="bg-white/20 rounded-lg p-4 backdrop-blur-sm">
              <div className="text-emerald-100 text-sm mb-1">पेंडिंग बैलेंस</div>
              <div className="text-2xl font-bold">₹{pendingBalance.toFixed(2)}</div>
              <div className="text-xs text-emerald-100 mt-1">वेरिफिकेशन में</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">डिपॉजिट रिवॉर्ड</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-600">₹{depositRewards.toFixed(2)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">डेली रिवॉर्ड</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">₹{dailyRewards.toFixed(2)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">रेफरल बोनस</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">₹{referralRewards.toFixed(2)}</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="withdraw" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="withdraw">निकासी</TabsTrigger>
          <TabsTrigger value="history">निकासी हिस्ट्री</TabsTrigger>
        </TabsList>

        <TabsContent value="withdraw">
          <Card className="shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingDown className="w-5 h-5" />
                पैसे निकालें
              </CardTitle>
              <CardDescription>
                ₹455 से ₹10,000 तक UPI से निकालें (24 घंटे में एक बार)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleWithdraw} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="withdraw-amount">राशि (₹)</Label>
                  <Input
                    id="withdraw-amount"
                    type="number"
                    placeholder="1000"
                    value={withdrawAmount}
                    onChange={(e) => setWithdrawAmount(e.target.value)}
                    disabled={isWithdrawing}
                    min="455"
                    max="10000"
                    step="1"
                  />
                  <p className="text-xs text-muted-foreground">
                    उपलब्ध: ₹{verifiedBalance.toFixed(2)}
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="upi-id">UPI ID</Label>
                  <Input
                    id="upi-id"
                    type="text"
                    placeholder="yourname@upi"
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                    disabled={isWithdrawing}
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-emerald-600 to-blue-600 hover:from-emerald-700 hover:to-blue-700"
                  disabled={isWithdrawing}
                >
                  {isWithdrawing ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      प्रोसेस हो रहा है...
                    </>
                  ) : (
                    <>
                      <TrendingDown className="w-4 h-4 mr-2" />
                      निकासी रिक्वेस्ट करें
                    </>
                  )}
                </Button>

                <div className="bg-muted rounded-lg p-4 text-sm">
                  <h4 className="font-semibold mb-2">नियम:</h4>
                  <ul className="space-y-1 text-muted-foreground">
                    <li>• न्यूनतम निकासी: ₹455</li>
                    <li>• अधिकतम निकासी: ₹10,000</li>
                    <li>• 24 घंटे में एक बार</li>
                    <li>• केवल वेरिफाइड बैलेंस निकाल सकते हैं</li>
                    <li>• एडमिन वेरिफिकेशन के बाद UPI में भेजा जाएगा</li>
                  </ul>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history">
          <Card className="shadow-xl">
            <CardHeader>
              <CardTitle>निकासी हिस्ट्री</CardTitle>
              <CardDescription>आपकी सभी निकासी रिक्वेस्ट</CardDescription>
            </CardHeader>
            <CardContent>
              {withdrawals.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <TrendingDown className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>अभी तक कोई निकासी नहीं</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {withdrawals.map((withdrawal) => (
                    <div
                      key={withdrawal.id}
                      className="flex items-center justify-between p-4 bg-muted rounded-lg"
                    >
                      <div className="flex-1">
                        <div className="font-semibold text-lg">₹{withdrawal.amount}</div>
                        <div className="text-sm text-muted-foreground">{withdrawal.upiId}</div>
                        <div className="text-xs text-muted-foreground mt-1">
                          {withdrawal.date.toLocaleDateString('hi-IN')} {withdrawal.date.toLocaleTimeString('hi-IN')}
                        </div>
                      </div>
                      <div>{getStatusBadge(withdrawal.status)}</div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
