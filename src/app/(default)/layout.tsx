'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';

export default function DefaultLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-gray-50 pb-16">
      <main>{children}</main>

      {/* Bottom Tab Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
        <div className="max-w-md mx-auto flex">
          <Link
            href="/writer"
            className={`flex-1 flex flex-col items-center py-2.5 transition-colors ${
              pathname === '/writer'
                ? 'text-blue-600'
                : 'text-gray-400 active:text-gray-600'
            }`}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 4v16m8-8H4" />
            </svg>
            <span className="text-[10px] mt-0.5 font-medium">기록</span>
          </Link>
          <Link
            href="/list"
            className={`flex-1 flex flex-col items-center py-2.5 transition-colors ${
              pathname === '/list'
                ? 'text-blue-600'
                : 'text-gray-400 active:text-gray-600'
            }`}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <span className="text-[10px] mt-0.5 font-medium">목록</span>
          </Link>
        </div>
      </nav>
    </div>
  );
}
