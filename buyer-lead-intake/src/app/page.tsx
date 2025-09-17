// src/app/page.tsx
export default function Home() {
  return (
    <main className="flex min-h-screen items-center justify-center">
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold">Welcome to Buyer CRM</h1>
        <p className="text-gray-600">Manage your leads easily 🚀</p>
        <a
          href="/buyers/new"
          className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          View Buyers
        </a>
      </div>
    </main>
  );
}
