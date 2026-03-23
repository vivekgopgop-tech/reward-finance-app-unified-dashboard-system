import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Home, Wallet, Gift, Users, CreditCard, Shield } from 'lucide-react';
import HomeDashboard from '../components/dashboards/HomeDashboard';
import DepositDashboard from '../components/dashboards/DepositDashboard';
import DailyRewardDashboard from '../components/dashboards/DailyRewardDashboard';
import ReferralDashboard from '../components/dashboards/ReferralDashboard';
import WalletDashboard from '../components/dashboards/WalletDashboard';
import AdminDashboard from './AdminDashboard';
import { useGetCallerUserProfile } from '../hooks/useQueries';

const ADMIN_EMAIL = 'vivekgopgop@gmail.com';
const ADMIN_EMAIL_2 = 'Kumarirani71318@gmail.com';
const ADMIN_PHONE = '9153873434';

export default function UnifiedDashboard() {
  const [activeTab, setActiveTab] = useState('home');
  const { data: userProfile } = useGetCallerUserProfile();
  
  // Check if user is authorized admin based on email or phone
  const isAuthorizedAdmin = 
    userProfile?.email === ADMIN_EMAIL || 
    userProfile?.email === ADMIN_EMAIL_2 ||
    userProfile?.phone === ADMIN_PHONE;

  return (
    <div className="max-w-6xl mx-auto">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className={`grid w-full ${isAuthorizedAdmin ? 'grid-cols-6' : 'grid-cols-5'} mb-8 h-auto p-1`}>
          <TabsTrigger value="home" className="flex flex-col gap-1 py-3">
            <Home className="w-5 h-5" />
            <span className="text-xs">होम</span>
          </TabsTrigger>
          <TabsTrigger value="deposit" className="flex flex-col gap-1 py-3">
            <CreditCard className="w-5 h-5" />
            <span className="text-xs">डिपॉजिट</span>
          </TabsTrigger>
          <TabsTrigger value="daily" className="flex flex-col gap-1 py-3">
            <Gift className="w-5 h-5" />
            <span className="text-xs">डेली रिवॉर्ड</span>
          </TabsTrigger>
          <TabsTrigger value="referral" className="flex flex-col gap-1 py-3">
            <Users className="w-5 h-5" />
            <span className="text-xs">रेफरल</span>
          </TabsTrigger>
          <TabsTrigger value="wallet" className="flex flex-col gap-1 py-3">
            <Wallet className="w-5 h-5" />
            <span className="text-xs">वॉलेट</span>
          </TabsTrigger>
          {isAuthorizedAdmin && (
            <TabsTrigger value="admin" className="flex flex-col gap-1 py-3">
              <Shield className="w-5 h-5" />
              <span className="text-xs">एडमिन</span>
            </TabsTrigger>
          )}
        </TabsList>

        <TabsContent value="home">
          <HomeDashboard onNavigate={setActiveTab} />
        </TabsContent>

        <TabsContent value="deposit">
          <DepositDashboard />
        </TabsContent>

        <TabsContent value="daily">
          <DailyRewardDashboard />
        </TabsContent>

        <TabsContent value="referral">
          <ReferralDashboard />
        </TabsContent>

        <TabsContent value="wallet">
          <WalletDashboard />
        </TabsContent>

        {isAuthorizedAdmin && (
          <TabsContent value="admin">
            <AdminDashboard />
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
}
