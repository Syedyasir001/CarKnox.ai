import type { Metadata } from 'next';
import { Bebas_Neue, DM_Sans } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const bebas = Bebas_Neue({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-bebas',
});

const dmSans = DM_Sans({
  weight: ['400', '500', '600'],
  subsets: ['latin'],
  variable: '--font-dmsans',
});

export const metadata: Metadata = {
  title: 'CarKnox — Know Before You Buy',
  description: 'AI-powered used car analysis for the Indian market.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${bebas.variable} ${dmSans.variable}`}>
      <body className="bg-[#0a0f1e] text-white antialiased">
        <a href="#analyze-form" className="skip-link">
          Skip to main content
        </a>
        <main className="min-h-screen flex flex-col" id="main-content" tabIndex={-1}>
          <Navbar />
          {children}
          <Footer />
        </main>
      </body>
    </html>
  );
}
