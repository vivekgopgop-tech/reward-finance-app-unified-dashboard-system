import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import DepositForm from '../components/DepositForm';
import DepositHistory from '../components/DepositHistory';
import { Wallet, History } from 'lucide-react';

export default function UserDashboard() {
  const [activeTab, setActiveTab] = useState('deposit');

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8 text-center">
        <h2 className="text-3xl font-bold mb-2">डैशबोर्ड</h2>
        <p className="text-muted-foreground">अपने डिपॉजिट को मैनेज करें</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-8">
          <TabsTrigger value="deposit" className="gap-2">
            <Wallet className="w-4 h-4" />
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
