import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { CreditCard, Gift, Users, Wallet, TrendingUp, Clock } from 'lucide-react';
import { useGetCallerUserProfile } from '../../hooks/useQueries';
import { useWalletStore } from '../../lib/walletStore';

interface HomeDashboardProps {
  onNavigate: (tab: string) => void;
}

export default function HomeDashboard({ onNavigate }: HomeDashboardProps) {
  const { data: userProfile } = useGetCallerUserProfile();
  const { totalBalance, verifiedBalance, pendingBalance } = useWalletStore();

  const quickActions = [
    {
      title: 'डिपॉजिट करें',
      description: 'रिवॉर्ड के साथ पैसे जमा करें',
      icon: CreditCard,
      color: 'from-emerald-500 to-emerald-600',
      action: () => onNavigate('deposit'),
    },
    {
      title: 'डेली रिवॉर्ड',
      description: 'आज का स्पिन क्लेम करें',
      icon: Gift,
      color: 'from-blue-500 to-blue-600',
      action: () => onNavigate('daily'),
    },
    {
      title: 'रेफर करें',
      description: 'दोस्तों को इनवाइट करें',
      icon: Users,
      color: 'from-purple-500 to-purple-600',
      action: () => onNavigate('referral'),
    },
    {
      title: 'वॉलेट',
      description: 'बैलेंस देखें और निकालें',
      icon: Wallet,
      color: 'from-orange-500 to-orange-600',
      action: () => onNavigate('wallet'),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-2">
          स्वागत है, {userProfile?.name || 'यूजर'}! 👋
        </h2>
        <p className="text-muted-foreground">आपके रिवॉर्ड फाइनेंस डैशबोर्ड में</p>
      </div>

      <Card className="bg-gradient-to-br from-emerald-500 to-blue-600 text-white border-0 shadow-2xl">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Wallet className="w-5 h-5" />
            कुल बैलेंस
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-4xl font-bold mb-4">₹{totalBalance.toFixed(2)}</div>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="bg-white/20 rounded-lg p-3 backdrop-blur-sm">
              <div className="text-emerald-100 mb-1">वेरिफाइड</div>
              <div className="font-semibold">₹{verifiedBalance.toFixed(2)}</div>
            </div>
            <div className="bg-white/20 rounded-lg p-3 backdrop-blur-sm">
              <div className="text-emerald-100 mb-1">पेंडिंग</div>
              <div className="font-semibold">₹{pendingBalance.toFixed(2)}</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div>
        <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
          <TrendingUp className="w-5 h-5" />
          क्विक एक्शन
        </h3>
        <div className="grid md:grid-cols-2 gap-4">
          {quickActions.map((action, index) => (
            <Card
              key={index}
              className="cursor-pointer hover:shadow-lg transition-all border-2 hover:border-primary"
              onClick={action.action}
            >
              <CardHeader>
                <div className={`w-12 h-12 bg-gradient-to-br ${action.color} rounded-lg flex items-center justify-center mb-3`}>
                  <action.icon className="w-6 h-6 text-white" />
                </div>
                <CardTitle>{action.title}</CardTitle>
                <CardDescription>{action.description}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5" />
            आज की गतिविधि
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 text-sm">
            <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center">
                  <CreditCard className="w-4 h-4 text-emerald-600" />
                </div>
                <span>डिपॉजिट रिवॉर्ड उपलब्ध</span>
              </div>
              <Button size="sm" variant="outline" onClick={() => onNavigate('deposit')}>
                जमा करें
              </Button>
            </div>
            <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                  <Gift className="w-4 h-4 text-blue-600" />
                </div>
                <span>डेली स्पिन उपलब्ध</span>
              </div>
              <Button size="sm" variant="outline" onClick={() => onNavigate('daily')}>
                स्पिन करें
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
