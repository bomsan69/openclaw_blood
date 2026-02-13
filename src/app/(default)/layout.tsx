export default function DefaultLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-gray-800">Blood Press Logs</h1>
            </div>
            <div className="flex items-center space-x-4">
              <a href="/list" className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">
                목록
              </a>
              <a href="/writer" className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">
                작성
              </a>
            </div>
          </div>
        </div>
      </nav>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
}
