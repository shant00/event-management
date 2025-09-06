import { Header } from '@/components/Header';
import { EventProvider } from '@/context/EventContext';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'EventHub - Event Management System',
  description: 'Create, manage, and discover events in your community',
  keywords: 'events, management, community, networking, conferences, workshops',
  authors: [{ name: 'Saiful Islam Shanto' }],
  viewport: 'width=device-width, initial-scale=1',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <body className={`${inter.className} h-full bg-gray-50 antialiased`}>
        <EventProvider>
          <div className="min-h-full flex flex-col">
            <Header />
            <main className="flex-1">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {children}
              </div>
            </main>

            {/* Footer */}
            <footer className="bg-white border-t border-gray-200 mt-auto">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                  <div className="flex items-center gap-2">
                    <div className="bg-blue-600 p-1.5 rounded-md">
                      <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span className="text-sm text-gray-600">
                      © 2025 EventHub. All rights reserved.
                    </span>
                  </div>

                  <div className="flex items-center gap-6 text-sm text-gray-500">
                    <span>Made By Shanto</span>
                  </div>
                </div>
              </div>
            </footer>
          </div>
        </EventProvider>
      </body>
    </html>
  );
}