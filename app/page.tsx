import AuthForm from '@/components/AuthForm';

export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
      <div className="w-full max-w-md">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-900 dark:text-white">
          Welcome Back
        </h1>
        <AuthForm />
      </div>
    </main>
  );
}