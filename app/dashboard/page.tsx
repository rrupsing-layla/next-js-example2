'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { supabase } from '@/lib/supabase';
import Navbar from '@/components/Navbar';

const Dashboard = () => {
  const router = useRouter();

  useEffect(() => {
    const checkUser = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) {
        router.push('/');
      }
    };

    checkUser();
  }, [router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white dark:from-gray-900 dark:to-gray-800">
      <Navbar />
      <main className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] p-8">
        <div className="text-center space-y-8">
          <h1 className="text-5xl font-bold text-gray-900 dark:text-white tracking-tight">
            Welcome Home
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-md mx-auto">
            Your baseball statistics dashboard awaits
          </p>
          <div className="relative w-full max-w-lg mx-auto mt-8">
            <Image
              src="https://www.shutterstock.com/image-vector/image-illustration-pitcher-throwing-ball-600nw-1811403769.jpg"
              alt="Baseball Pitcher Illustration"
              width={600}
              height={400}
              className="rounded-lg shadow-xl"
              priority
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;