'use client';

import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Link from 'next/link';

export default function Navbar() {
  const router = useRouter();
  const { toast } = useToast();

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast({
        title: 'Error',
        description: 'Failed to sign out.',
        variant: 'destructive',
      });
    } else {
      toast({
        title: 'Signed out',
        description: 'You have been signed out successfully.',
      });
      router.push('/');
    }
  };

  return (
    <nav className="bg-white dark:bg-gray-800 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center space-x-8">
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">Baseball Stats</h1>
            <Tabs defaultValue="dashboard" className="w-auto">
              <TabsList>
                <TabsTrigger value="dashboard" asChild>
                  <Link href="/dashboard">Dashboard</Link>
                </TabsTrigger>
                <TabsTrigger value="teams" asChild>
                  <Link href="/dashboard/teams">Teams</Link>
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
          <Button
            variant="ghost"
            onClick={handleLogout}
            className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
          >
            Sign Out
          </Button>
        </div>
      </div>
    </nav>
  );
}