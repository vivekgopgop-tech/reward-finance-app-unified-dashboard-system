import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { Button } from './ui/button';
import { Loader2, Wallet, Gift, Users, TrendingUp, Shield } from 'lucide-react';

export default function WelcomeScreen() {
  const { login, loginStatus } = useInternetIdentity();
  const disabled = loginStatus === 'logging-in';

  const handleLogin = async () => {
    try {
      await login();
    } catch (error: any) {
      console.error('Login error:', error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-12">
        <div className="w-24 h-24 bg-gradient-to-br from-emerald-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl">
          <Wallet className="w-12 h-12 text-white" />
        </div>
        <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">
          रिवॉर्ड फाइनेंस
        </h1>
        <p className="text-xl text-muted-foreground mb-8">
          डिपॉजिट करें, रिवॉर्ड पाएं और कमाई करें
        </p>
        <Button
          onClick={handleLogin}
          disabled={disabled}
          size="lg"
          className="bg-gradient-to-r from-emerald-600 to-blue-600 hover:from-emerald-700 hover:to-blue-700 text-lg px-8 py-6 h-auto"
        >
          {disabled ? (
            <>
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              लॉगिन हो रहा है...
            </>
          ) : (
            'अभी शुरू करें'
          )}
        </Button>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-12">
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
          <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg flex items-center justify-center mb-4">
            <TrendingUp className="w-6 h-6 text-emerald-600" />
          </div>
          <h3 className="text-xl font-bold mb-2">डिपॉजिट रिवॉर्ड</h3>
          <p className="text-muted-foreground mb-4">
            ₹100 से ₹1,00,000 तक डिपॉजिट करें और फिक्स + 4% तक बोनस पाएं
          </p>
          <ul className="space-y-2 text-sm">
            <li className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-emerald-600 rounded-full"></div>
              ₹100 → ₹5 रिवॉर्ड
            </li>
            <li className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-emerald-600 rounded-full"></div>
              ₹500 → ₹35 और ₹1000 → ₹100
            </li>
            <li className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-emerald-600 rounded-full"></div>
              ₹1000+ → 4% रिवॉर्ड
            </li>
          </ul>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
          <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center mb-4">
            <Gift className="w-6 h-6 text-blue-600" />
          </div>
          <h3 className="text-xl font-bold mb-2">डेली रिवॉर्ड गेम</h3>
          <p className="text-muted-foreground mb-4">
            रोज स्पिनिंग व्हील खेलें और ₹1 से ₹10 तक जीतें
          </p>
          <ul className="space-y-2 text-sm">
            <li className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-blue-600 rounded-full"></div>
              दिन में एक बार फ्री स्पिन
            </li>
            <li className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-blue-600 rounded-full"></div>
              तुरंत वॉलेट में जमा
            </li>
          </ul>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
          <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center mb-4">
            <Users className="w-6 h-6 text-purple-600" />
          </div>
          <h3 className="text-xl font-bold mb-2">रेफरल बोनस</h3>
          <p className="text-muted-foreground mb-4">
            दोस्तों को रेफर करें और दोनों को बोनस मिलेगा
          </p>
          <ul className="space-y-2 text-sm">
            <li className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-purple-600 rounded-full"></div>
              आपको ₹5 प्रति रेफरल
            </li>
            <li className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-purple-600 rounded-full"></div>
              नए यूजर को ₹15 बोनस
            </li>
          </ul>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
          <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-lg flex items-center justify-center mb-4">
            <Shield className="w-6 h-6 text-orange-600" />
          </div>
          <h3 className="text-xl font-bold mb-2">सुरक्षित निकासी</h3>
          <p className="text-muted-foreground mb-4">
            ₹455 से ₹10,000 तक UPI से निकालें
          </p>
          <ul className="space-y-2 text-sm">
            <li className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-orange-600 rounded-full"></div>
              24 घंटे में एक बार
            </li>
            <li className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-orange-600 rounded-full"></div>
              तेज़ वेरिफिकेशन
            </li>
          </ul>
        </div>
      </div>

      <div className="bg-gradient-to-r from-emerald-600 to-blue-600 rounded-2xl p-8 text-white text-center shadow-2xl">
        <h2 className="text-2xl font-bold mb-2">आज ही शुरू करें!</h2>
        <p className="text-emerald-50 mb-6">
          लॉगिन करें और अपनी कमाई शुरू करें
        </p>
        <Button
          onClick={handleLogin}
          disabled={disabled}
          size="lg"
          variant="secondary"
          className="bg-white text-emerald-600 hover:bg-gray-100"
        >
          {disabled ? (
            <>
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              लॉगिन हो रहा है...
            </>
          ) : (
            'लॉगिन करें'
          )}
        </Button>
      </div>
    </div>
  );
}
