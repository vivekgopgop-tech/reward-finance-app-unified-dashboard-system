import { useState } from 'react';
import { useCreateDepositRequest } from '../hooks/useQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { PaymentMethod } from '../backend';
import { Loader2, Info } from 'lucide-react';
import { toast } from 'sonner';
import QRCodeDisplay from './QRCodeDisplay';
import { SiPhonepe, SiGooglepay, SiPaytm } from 'react-icons/si';

const paymentMethods = [
  { id: 'phonePe' as PaymentMethod, label: 'PhonePe', icon: SiPhonepe, color: 'text-purple-600' },
  { id: 'googlePay' as PaymentMethod, label: 'Google Pay', icon: SiGooglepay, color: 'text-blue-600' },
  { id: 'paytm' as PaymentMethod, label: 'Paytm', icon: SiPaytm, color: 'text-sky-600' },
  { id: 'bhim' as PaymentMethod, label: 'BHIM', icon: null, color: 'text-orange-600' },
];

function calculateReward(amount: number): number {
  if (amount === 100) return 5;
  if (amount === 200) return 15;
  if (amount === 300) return 20;
  if (amount === 400) return 30;
  if (amount === 500) return 35;
  if (amount === 600) return 40;
  if (amount === 700) return 45;
  if (amount === 800) return 50;
  if (amount === 900) return 60;
  if (amount === 1000) return 100;
  if (amount > 1000 && amount <= 100000) return amount * 0.04;
  return 0;
}

export default function DepositForm() {
  const [amount, setAmount] = useState('');
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod | null>(null);
  const [requestId, setRequestId] = useState<string | null>(null);
  const createRequest = useCreateDepositRequest();

  const amountNum = parseFloat(amount) || 0;
  const reward = calculateReward(amountNum);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!amountNum || amountNum < 100 || amountNum > 100000) {
      toast.error('राशि ₹100 से ₹1,00,000 के बीच होनी चाहिए');
      return;
    }

    if (!selectedMethod) {
      toast.error('कृपया पेमेंट मेथड चुनें');
      return;
    }

    try {
      const id = await createRequest.mutateAsync({
        amount: BigInt(Math.floor(amountNum)),
        paymentMethod: selectedMethod,
      });
      setRequestId(id);
      toast.success('QR कोड जनरेट हो गया!');
    } catch (error) {
      toast.error('रिक्वेस्ट बनाने में त्रुटि');
      console.error(error);
    }
  };

  const handleReset = () => {
    setRequestId(null);
    setAmount('');
    setSelectedMethod(null);
  };

  if (requestId) {
    return <QRCodeDisplay requestId={requestId} onBack={handleReset} />;
  }

  return (
    <Card className="shadow-xl">
      <CardHeader>
        <CardTitle className="text-2xl">नया डिपॉजिट</CardTitle>
        <CardDescription>राशि और पेमेंट मेथड चुनें और रिवॉर्ड पाएं</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="amount" className="text-base">राशि (₹)</Label>
            <Input
              id="amount"
              type="number"
              placeholder="1000"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              disabled={createRequest.isPending}
              className="text-lg h-12"
              min="100"
              max="100000"
              step="1"
            />
            {amountNum >= 100 && (
              <div className="flex items-center gap-2 text-sm text-emerald-600 dark:text-emerald-400">
                <Info className="w-4 h-4" />
                <span>आपको ₹{reward.toFixed(2)} रिवॉर्ड मिलेगा</span>
              </div>
            )}
          </div>

          <div className="space-y-3">
            <Label className="text-base">पेमेंट मेथड चुनें</Label>
            <div className="grid grid-cols-2 gap-3">
              {paymentMethods.map((method) => (
                <button
                  key={method.id}
                  type="button"
                  onClick={() => setSelectedMethod(method.id)}
                  disabled={createRequest.isPending}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    selectedMethod === method.id
                      ? 'border-primary bg-primary/5 shadow-md'
                      : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                  } disabled:opacity-50`}
                >
                  <div className="flex flex-col items-center gap-2">
                    {method.icon ? (
                      <method.icon className={`w-8 h-8 ${method.color}`} />
                    ) : (
                      <div className={`w-8 h-8 rounded-full ${method.color} bg-current/10 flex items-center justify-center font-bold`}>
                        B
                      </div>
                    )}
                    <span className="font-medium text-sm">{method.label}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="bg-muted rounded-lg p-4 text-sm">
            <h4 className="font-semibold mb-2">रिवॉर्ड स्ट्रक्चर:</h4>
            <ul className="space-y-1 text-muted-foreground">
              <li>• ₹100 → ₹5 रिवॉर्ड</li>
              <li>• ₹200 → ₹15 रिवॉर्ड</li>
              <li>• ₹300 → ₹20 रिवॉर्ड</li>
              <li>• ₹400 → ₹30 रिवॉर्ड</li>
              <li>• ₹500 → ₹35, ₹600 → ₹40, ₹700 → ₹45</li>
              <li>• ₹800 → ₹50, ₹900 → ₹60, ₹1000 → ₹100</li>
              <li>• ₹1000 से ₹1,00,000 तक 4% बोनस (स्कीम के अनुसार)</li>
            </ul>
          </div>

          <Button
            type="submit"
            className="w-full h-12 text-base bg-gradient-to-r from-emerald-600 to-blue-600 hover:from-emerald-700 hover:to-blue-700"
            disabled={createRequest.isPending}
          >
            {createRequest.isPending ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                QR कोड जनरेट हो रहा है...
              </>
            ) : (
              'QR कोड जनरेट करें'
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
