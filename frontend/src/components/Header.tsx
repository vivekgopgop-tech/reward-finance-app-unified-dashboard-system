import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useQueryClient } from '@tanstack/react-query';
import { Button } from './ui/button';
import { useGetCallerUserProfile, useGetCallerUserRole } from '../hooks/useQueries';
import { Loader2, LogOut, User, Shield, Wallet } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { useWalletStore } from '../lib/walletStore';

export default function Header() {
  const { login, clear, loginStatus, identity } = useInternetIdentity();
  const queryClient = useQueryClient();
  const { data: userProfile } = useGetCallerUserProfile();
  const { data: userRole } = useGetCallerUserRole();
  const { totalBalance, reset: resetWallet } = useWalletStore();

  const isAuthenticated = !!identity;
  const disabled = loginStatus === 'logging-in';
  const isAdmin = userRole === 'admin';

  const handleAuth = async () => {
    if (isAuthenticated) {
      await clear();
      queryClient.clear();
      resetWallet();
    } else {
      try {
        await login();
      } catch (error: any) {
        console.error('Login error:', error);
        if (error.message === 'User is already authenticated') {
          await clear();
          setTimeout(() => login(), 300);
        }
      }
    }
  };

  return (
    <header className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-blue-600 rounded-lg flex items-center justify-center">
              <Wallet className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">
                रिवॉर्ड फाइनेंस
              </h1>
              <p className="text-xs text-muted-foreground">कमाई का नया तरीका</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {isAuthenticated && userProfile && !isAdmin && (
              <div className="hidden sm:flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-emerald-500 to-blue-600 text-white rounded-lg">
                <Wallet className="w-4 h-4" />
                <span className="font-semibold">₹{totalBalance.toFixed(2)}</span>
              </div>
            )}
            {isAuthenticated && userProfile ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="gap-2">
                    <User className="w-4 h-4" />
                    <span className="hidden sm:inline">{userProfile.name}</span>
                    {isAdmin && <Shield className="w-4 h-4 text-purple-600" />}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>मेरा अकाउंट</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem disabled>
                    <User className="w-4 h-4 mr-2" />
                    {userProfile.name}
                  </DropdownMenuItem>
                  {isAdmin && (
                    <DropdownMenuItem disabled>
                      <Shield className="w-4 h-4 mr-2" />
                      एडमिन
                    </DropdownMenuItem>
                  )}
                  {!isAdmin && (
                    <DropdownMenuItem disabled>
                      <Wallet className="w-4 h-4 mr-2" />
                      ₹{totalBalance.toFixed(2)}
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleAuth} className="text-destructive">
                    <LogOut className="w-4 h-4 mr-2" />
                    लॉगआउट
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button
                onClick={handleAuth}
                disabled={disabled}
                className="bg-gradient-to-r from-emerald-600 to-blue-600 hover:from-emerald-700 hover:to-blue-700"
              >
                {disabled ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    लॉगिन हो रहा है...
                  </>
                ) : (
                  'लॉगिन करें'
                )}
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
