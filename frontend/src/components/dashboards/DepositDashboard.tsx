import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { CreditCard, History } from 'lucide-react';
import DepositForm from '../DepositForm';
import DepositHistory from '../DepositHistory';

export default function DepositDashboard() {
  const [activeTab, setActiveTab] = useState('deposit');

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-3xl font-bold mb-2">डिपॉजिट रिवॉर्ड</h2>
        <p className="text-muted-foreground">पैसे जमा करें और रिवॉर्ड पाएं</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="deposit" className="gap-2">
            <CreditCard className="w-4 h-4" />
            नया डिपॉजिट
          </TabsTrigger>
          <TabsTrigger value="history" className="gap-2">
            <History className="w-4 h-4" />
            हिस्ट्री
          </TabsTrigger>
        </TabsList>

        <TabsContent value="deposit">
          <DepositForm />
        </TabsContent>

        <TabsContent value="history">
          <DepositHistory />
        </TabsContent>
      </Tabs>
    </div>
  );
}
