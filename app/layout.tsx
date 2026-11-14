import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'طَرَب — الأرشيف الموسيقي العربي',
  description: 'اكتشف الموسيقى العربية واستمع إليها من مصادرها الرسمية والمرخصة.',
  applicationName: 'Tarab Arabic Music Archive',
  manifest: '/manifest.webmanifest',
};

export const viewport: Viewport = {
  themeColor: '#101116',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ar" dir="rtl">
      <body>{children}</body>
    </html>
  );
}
