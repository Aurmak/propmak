import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'PROPMAK — Enterprise Property Management Platform',
  description: 'Automated property management platform: Rent roll, WhatsApp ingestion, maintenance dispatch, utility tracking, and landlord net payouts.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <body className="h-full antialiased font-sans">
        {children}
      </body>
    </html>
  );
}
