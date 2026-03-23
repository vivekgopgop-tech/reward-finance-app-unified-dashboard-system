import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Users, Copy, Share2, Gift, TrendingUp } from 'lucide-react';
import { toast } from 'sonner';
import { useInternetIdentity } from '../../hooks/useInternetIdentity';
import { SiWhatsapp, SiTelegram, SiFacebook } from 'react-icons/si';

export default function ReferralDashboard() {
  const { identity } = useInternetIdentity();
  const [referralCode, setReferralCode] = useState('');
  const [referralCount, setReferralCount] = useState(0);
  const [referralEarnings, setReferralEarnings] = useState(0);

  useEffect(() => {
    if (identity) {
      const principal = identity.getPrincipal().toString();
      const code = principal.slice(0, 8).toUpperCase();
      setReferralCode(code);

      const stored = localStorage.getItem(`referrals_${principal}`);
      if (stored) {
        const data = JSON.parse(stored);
        setReferralCount(data.count || 0);
        setReferralEarnings(data.earnings || 0);
      }
    }
  }, [identity]);

  const referralLink = `${window.location.origin}?ref=${referralCode}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(referralLink);
    toast.success('रेफरल लिंक कॉपी हो गया!');
  };

  const shareOnWhatsApp = () => {
    const message = `रिवॉर्ड फाइनेंस ऐप ज्वाइन करें और ₹15 बोनस पाएं! मेरा रेफरल कोड: ${referralCode}\n${referralLink}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, '_blank');
  };

  const shareOnTelegram = () => {
    const message = `रिवॉर्ड फाइनेंस ऐप ज्वाइन करें और ₹15 बोनस पाएं! मेरा रेफरल कोड: ${referralCode}\n${referralLink}`;
    window.open(`https://t.me/share/url?url=${encodeURIComponent(referralLink)}&text=${encodeURIComponent(message)}`, '_blank');
  };

  const shareOnFacebook = () => {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(referralLink)}`, '_blank');
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div className="text-center mb-6">
        <h2 className="text-3xl font-bold mb-2">रेफरल प्रोग्राम</h2>
        <p className="text-muted-foreground">दोस्तों को रेफर करें और दोनों को बोनस मिलेगा</p>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white border-0">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Users className="w-5 h-5" />
              कुल रेफरल
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold">{referralCount}</div>
            <p className="text-purple-100 mt-2">सफल रेफरल</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-emerald-500 to-emerald-600 text-white border-0">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              रेफरल कमाई
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold">₹{referralEarnings}</div>
            <p className="text-emerald-100 mt-2">कुल कमाई</p>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-xl">
        <CardHeader>
          <CardTitle>आपका रेफरल कोड</CardTitle>
          <CardDescription>इस कोड को शेयर करें और कमाई करें</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <div className="flex-1 bg-muted rounded-lg p-4 font-mono text-2xl font-bold text-center">
              {referralCode}
            </div>
            <Button onClick={copyToClipboard} size="lg" variant="outline">
              <Copy className="w-5 h-5" />
            </Button>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">रेफरल लिंक</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={referralLink}
                readOnly
                className="flex-1 px-3 py-2 bg-muted rounded-lg text-sm"
              />
              <Button onClick={copyToClipboard} variant="outline">
                <Copy className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">शेयर करें</label>
            <div className="grid grid-cols-4 gap-2">
              <Button onClick={shareOnWhatsApp} variant="outline" className="flex-col h-auto py-3">
                <SiWhatsapp className="w-6 h-6 text-green-600 mb-1" />
                <span className="text-xs">WhatsApp</span>
              </Button>
              <Button onClick={shareOnTelegram} variant="outline" className="flex-col h-auto py-3">
                <SiTelegram className="w-6 h-6 text-blue-600 mb-1" />
                <span className="text-xs">Telegram</span>
              </Button>
              <Button onClick={shareOnFacebook} variant="outline" className="flex-col h-auto py-3">
                <SiFacebook className="w-6 h-6 text-blue-700 mb-1" />
                <span className="text-xs">Facebook</span>
              </Button>
              <Button onClick={copyToClipboard} variant="outline" className="flex-col h-auto py-3">
                <Share2 className="w-6 h-6 text-gray-600 mb-1" />
                <span className="text-xs">अन्य</span>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Gift className="w-5 h-5" />
            रेफरल बोनस
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4 border-2 border-purple-200 dark:border-purple-800">
              <div className="text-3xl font-bold text-purple-600 mb-2">₹5</div>
              <p className="text-sm text-muted-foreground">आपको प्रति रेफरल</p>
            </div>
            <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded-lg p-4 border-2 border-emerald-200 dark:border-emerald-800">
              <div className="text-3xl font-bold text-emerald-600 mb-2">₹15</div>
              <p className="text-sm text-muted-foreground">नए यूजर को बोनस</p>
            </div>
          </div>

          <div className="mt-6 bg-muted rounded-lg p-4 text-sm">
            <h4 className="font-semibold mb-2">कैसे काम करता है:</h4>
            <ul className="space-y-1 text-muted-foreground">
              <li>1. अपना रेफरल कोड या लिंक शेयर करें</li>
              <li>2. जब कोई आपके लिंक से साइन अप करे</li>
              <li>3. आपको ₹5 और उन्हें ₹15 मिलेगा</li>
              <li>4. बोनस तुरंत वॉलेट में जमा होगा</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
