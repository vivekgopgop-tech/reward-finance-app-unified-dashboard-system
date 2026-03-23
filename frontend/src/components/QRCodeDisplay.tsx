import { useEffect, useState } from 'react';
import { useGetDepositRequest, useSubmitUtr } from '../hooks/useQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Loader2, ArrowLeft, CheckCircle, Copy, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';

interface QRCodeDisplayProps {
  requestId: string;
  onBack: () => void;
}

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

// Simple QR code generator using SVG
function generateQRCodeSVG(data: string): string {
  // For production, we'll create a simple data URL that opens the UPI link
  // This is a placeholder - in a real app, you'd use a proper QR library
  const size = 300;
  const encoded = encodeURIComponent(data);
  
  // Create a simple SVG with the UPI data embedded
  // Note: This creates a visual representation, but for actual QR scanning,
  // we rely on the "Open in App" button which uses the UPI deep link
  return `data:image/svg+xml,${encoded}`;
}

export default function QRCodeDisplay({ requestId, onBack }: QRCodeDisplayProps) {
  const { data: request, isLoading } = useGetDepositRequest(requestId);
  const submitUtr = useSubmitUtr();
  const [utr, setUtr] = useState('');
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string>('');

  useEffect(() => {
    if (request?.qrCodeData) {
      // Generate QR code using a free API service
      const qrApiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(request.qrCodeData)}`;
      setQrCodeDataUrl(qrApiUrl);
    }
  }, [request?.qrCodeData]);

  const handleSubmitUtr = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!utr.trim()) {
      toast.error('कृपया UTR नंबर दर्ज करें');
      return;
    }

    try {
      await submitUtr.mutateAsync({ requestId, utr: utr.trim() });
      toast.success('UTR सबमिट हो गया! वेरिफिकेशन का इंतजार करें');
      setUtr('');
    } catch (error) {
      toast.error('UTR सबमिट करने में त्रुटि');
      console.error(error);
    }
  };

  const handleCopyUPI = () => {
    navigator.clipboard.writeText('95232483@axl');
    toast.success('UPI ID कॉपी हो गई!');
  };

  const handleOpenUPI = () => {
    if (request?.qrCodeData) {
      window.location.href = request.qrCodeData;
    }
  };

  if (isLoading) {
    return (
      <Card className="shadow-xl">
        <CardContent className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </CardContent>
      </Card>
    );
  }

  if (!request) {
    return (
      <Card className="shadow-xl">
        <CardContent className="text-center py-20">
          <p className="text-muted-foreground">रिक्वेस्ट नहीं मिली</p>
          <Button onClick={onBack} className="mt-4">
            वापस जाएं
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-xl">
      <CardHeader>
        <div className="flex items-center gap-2 mb-2">
          <Button variant="ghost" size="sm" onClick={onBack}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <CardTitle className="text-2xl">QR कोड स्कैन करें</CardTitle>
            <CardDescription>
              {paymentMethodLabels[request.paymentMethod]} से पेमेंट करें
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-900 rounded-xl p-6 text-center">
          <div className="inline-block bg-white p-4 rounded-xl shadow-lg">
            {qrCodeDataUrl ? (
              <img 
                src={qrCodeDataUrl} 
                alt="UPI QR Code" 
                className="w-[300px] h-[300px]"
                onError={(e) => {
                  // Fallback if QR API fails
                  e.currentTarget.style.display = 'none';
                }}
              />
            ) : (
              <div className="w-[300px] h-[300px] flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded">
                <Loader2 className="w-12 h-12 animate-spin text-primary" />
              </div>
            )}
          </div>
          <div className="mt-4 space-y-2">
            <p className="text-3xl font-bold text-primary">
              ₹{Number(request.amount).toLocaleString('en-IN')}
            </p>
            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <span>UPI ID: 95232483@axl</span>
              <Button variant="ghost" size="sm" onClick={handleCopyUPI}>
                <Copy className="w-3 h-3" />
              </Button>
            </div>
          </div>
        </div>

        <div className="flex gap-2">
          <Button
            onClick={handleOpenUPI}
            className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
          >
            <ExternalLink className="w-4 h-4 mr-2" />
            {paymentMethodLabels[request.paymentMethod]} में खोलें
          </Button>
        </div>

        {request.status === 'verified' ? (
          <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4 text-center">
            <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-2" />
            <p className="font-semibold text-green-800 dark:text-green-200">
              पेमेंट वेरिफाई हो गया!
            </p>
            <p className="text-sm text-green-600 dark:text-green-300 mt-1">
              आपका डिपॉजिट सफलतापूर्वक प्रोसेस हो गया है
            </p>
          </div>
        ) : request.status === 'failed' ? (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 text-center">
            <p className="font-semibold text-red-800 dark:text-red-200">
              पेमेंट रिजेक्ट हो गया
            </p>
            <p className="text-sm text-red-600 dark:text-red-300 mt-1">
              कृपया फिर से कोशिश करें
            </p>
          </div>
        ) : request.utr ? (
          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 text-center">
            <p className="font-semibold text-yellow-800 dark:text-yellow-200">
              वेरिफिकेशन पेंडिंग है
            </p>
            <p className="text-sm text-yellow-600 dark:text-yellow-300 mt-1">
              UTR: {request.utr}
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmitUtr} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="utr">पेमेंट के बाद UTR नंबर दर्ज करें</Label>
              <Input
                id="utr"
                type="text"
                placeholder="UTR/Transaction ID"
                value={utr}
                onChange={(e) => setUtr(e.target.value)}
                disabled={submitUtr.isPending}
                className="text-lg"
              />
              <p className="text-xs text-muted-foreground">
                UTR नंबर आपके पेमेंट ऐप में मिलेगा
              </p>
            </div>
            <Button
              type="submit"
              className="w-full"
              disabled={submitUtr.isPending}
            >
              {submitUtr.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  सबमिट हो रहा है...
                </>
              ) : (
                'UTR सबमिट करें'
              )}
            </Button>
          </form>
        )}
      </CardContent>
    </Card>
  );
}
