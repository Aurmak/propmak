import type { Metadata } from 'next';
import { IBM_Plex_Mono } from 'next/font/google';
import './globals.css';

export const metadata: Metadata = {
  title: 'PROPMAK — Enterprise Property Management Platform',
  description: 'Automated property management platform: Rent roll, WhatsApp ingestion, maintenance dispatch, utility tracking, and landlord net payouts.',
};

const plexMono = IBM_Plex_Mono({
  subsets: ['latin'],
  variable: '--font-plex-mono',
  weight: ['400', '500', '600'],
  display: 'swap',
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`h-full ${plexMono.variable}`}>
      <body className="h-full antialiased font-sans">
        {children}
      </body>
    </html>
  );
}
