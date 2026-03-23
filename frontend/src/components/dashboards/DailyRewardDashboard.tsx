import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Gift, Loader2, Trophy, Clock } from 'lucide-react';
import { toast } from 'sonner';
import { useWalletStore } from '../../lib/walletStore';

export default function DailyRewardDashboard() {
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [reward, setReward] = useState<number | null>(null);
  const [canSpin, setCanSpin] = useState(true);
  const [nextSpinTime, setNextSpinTime] = useState<Date | null>(null);
  const { addDailyReward } = useWalletStore();

  useEffect(() => {
    const lastSpin = localStorage.getItem('lastDailySpin');
    if (lastSpin) {
      const lastSpinDate = new Date(lastSpin);
      const now = new Date();
      const timeDiff = now.getTime() - lastSpinDate.getTime();
      const hoursDiff = timeDiff / (1000 * 60 * 60);

      if (hoursDiff < 24) {
        setCanSpin(false);
        const nextSpin = new Date(lastSpinDate.getTime() + 24 * 60 * 60 * 1000);
        setNextSpinTime(nextSpin);
      }
    }
  }, []);

  const handleSpin = async () => {
    if (!canSpin) {
      toast.error('आप 24 घंटे में एक बार ही स्पिन कर सकते हैं');
      return;
    }

    setIsSpinning(true);
    setReward(null);

    const rewardAmount = Math.floor(Math.random() * 5) + 1;
    const spins = 5 + Math.random() * 3;
    const finalRotation = rotation + 360 * spins + (rewardAmount - 1) * 72;

    setRotation(finalRotation);

    setTimeout(() => {
      setReward(rewardAmount);
      setIsSpinning(false);
      addDailyReward(rewardAmount);
      
      const now = new Date();
      localStorage.setItem('lastDailySpin', now.toISOString());
      setCanSpin(false);
      const nextSpin = new Date(now.getTime() + 24 * 60 * 60 * 1000);
      setNextSpinTime(nextSpin);

      toast.success(`बधाई हो! आपने ₹${rewardAmount} जीता!`);
    }, 3000);
  };

  const getTimeUntilNextSpin = () => {
    if (!nextSpinTime) return '';
    const now = new Date();
    const diff = nextSpinTime.getTime() - now.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours} घंटे ${minutes} मिनट`;
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div className="text-center mb-6">
        <h2 className="text-3xl font-bold mb-2">डेली रिवॉर्ड गेम</h2>
        <p className="text-muted-foreground">स्पिनिंग व्हील घुमाएं और ₹1 से ₹5 तक जीतें</p>
      </div>

      <Card className="shadow-xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Gift className="w-5 h-5" />
            आज का स्पिन
          </CardTitle>
          <CardDescription>
            {canSpin ? 'अपना फ्री स्पिन क्लेम करें!' : `अगला स्पिन: ${getTimeUntilNextSpin()} में`}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="relative w-64 h-64 mx-auto">
            <div
              className="w-full h-full rounded-full border-8 border-primary shadow-2xl transition-transform duration-3000 ease-out"
              style={{
                transform: `rotate(${rotation}deg)`,
                background: 'conic-gradient(from 0deg, #10b981 0deg 72deg, #3b82f6 72deg 144deg, #8b5cf6 144deg 216deg, #f59e0b 216deg 288deg, #ef4444 288deg 360deg)',
              }}
            >
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-16 h-16 bg-white dark:bg-gray-800 rounded-full shadow-lg flex items-center justify-center">
                  <Gift className="w-8 h-8 text-primary" />
                </div>
              </div>
              {[1, 2, 3, 4, 5].map((num, index) => (
                <div
                  key={num}
                  className="absolute text-white font-bold text-xl"
                  style={{
                    top: '50%',
                    left: '50%',
                    transform: `rotate(${index * 72 + 36}deg) translateY(-90px)`,
                  }}
                >
                  ₹{num}
                </div>
              ))}
            </div>
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-2">
              <div className="w-0 h-0 border-l-8 border-r-8 border-t-12 border-l-transparent border-r-transparent border-t-primary"></div>
            </div>
          </div>

          {reward !== null && (
            <div className="text-center p-6 bg-gradient-to-r from-emerald-500 to-blue-600 rounded-xl text-white">
              <Trophy className="w-12 h-12 mx-auto mb-3" />
              <h3 className="text-2xl font-bold mb-2">बधाई हो!</h3>
              <p className="text-3xl font-bold">₹{reward}</p>
              <p className="text-emerald-100 mt-2">आपके वॉलेट में जमा हो गया</p>
            </div>
          )}

          <Button
            onClick={handleSpin}
            disabled={!canSpin || isSpinning}
            className="w-full h-14 text-lg bg-gradient-to-r from-emerald-600 to-blue-600 hover:from-emerald-700 hover:to-blue-700"
          >
            {isSpinning ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                स्पिन हो रहा है...
              </>
            ) : !canSpin ? (
              <>
                <Clock className="w-5 h-5 mr-2" />
                अगला स्पिन: {getTimeUntilNextSpin()}
              </>
            ) : (
              <>
                <Gift className="w-5 h-5 mr-2" />
                स्पिन करें
              </>
            )}
          </Button>

          <div className="bg-muted rounded-lg p-4 text-sm">
            <h4 className="font-semibold mb-2">नियम:</h4>
            <ul className="space-y-1 text-muted-foreground">
              <li>• दिन में एक बार फ्री स्पिन</li>
              <li>• ₹1 से ₹5 तक जीत सकते हैं</li>
              <li>• रिवॉर्ड तुरंत वॉलेट में जमा होगा</li>
              <li>• अगला स्पिन 24 घंटे बाद</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
