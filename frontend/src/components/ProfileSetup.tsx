import { useState } from 'react';
import { useSaveCallerUserProfile } from '../hooks/useQueries';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Loader2, User } from 'lucide-react';
import { toast } from 'sonner';

export default function ProfileSetup() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const saveProfile = useSaveCallerUserProfile();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error('कृपया अपना नाम दर्ज करें');
      return;
    }

    try {
      await saveProfile.mutateAsync({
        name: name.trim(),
        email: email.trim() || undefined,
        phone: phone.trim() || undefined,
      });
      toast.success('प्रोफाइल सफलतापूर्वक बनाई गई!');
    } catch (error) {
      toast.error('प्रोफाइल बनाने में त्रुटि');
      console.error(error);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20">
      <Card className="shadow-xl border-2">
        <CardHeader className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <User className="w-8 h-8 text-white" />
          </div>
          <CardTitle className="text-2xl">स्वागत है!</CardTitle>
          <CardDescription>कृपया अपनी जानकारी दर्ज करें</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">आपका नाम *</Label>
              <Input
                id="name"
                type="text"
                placeholder="अपना नाम दर्ज करें"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={saveProfile.isPending}
                className="text-lg"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">ईमेल (वैकल्पिक)</Label>
              <Input
                id="email"
                type="email"
                placeholder="आपका ईमेल"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={saveProfile.isPending}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">फोन नंबर (वैकल्पिक)</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="आपका फोन नंबर"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                disabled={saveProfile.isPending}
              />
            </div>
            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              disabled={saveProfile.isPending}
            >
              {saveProfile.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  सेव हो रहा है...
                </>
              ) : (
                'जारी रखें'
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
