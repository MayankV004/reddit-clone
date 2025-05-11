import { requireAuth } from "@/lib/session";

export default async function ProfilePage() {
  const user = await requireAuth();
  
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-4">Profile</h1>
      <div className="bg-white dark:bg-zinc-800 p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-2">Welcome, {user.name}!</h2>
        <p className="text-gray-600 dark:text-gray-300">Email: {user.email}</p>
      </div>
    </div>
  );
}