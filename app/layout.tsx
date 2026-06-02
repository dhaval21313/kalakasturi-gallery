import type { Metadata } from 'next';
import './globals.css';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import AccessibilityManager from '@/components/AccessibilityManager';
import { Inter, Playfair_Display, Allura, Merriweather } from 'next/font/google';

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });
const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-serif' });
const allura = Allura({ weight: "400", subsets: ['latin'], variable: '--font-allura' });
const merriweather = Merriweather({ weight: ["300", "400", "700", "900"], subsets: ['latin'], variable: '--font-merriweather' });

export const metadata: Metadata = {
  title: 'KalaKasturi | Original Canvas Art',
  description: 'Premium original paintings, acrylics, and wabi-sabi abstracts.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable} ${allura.variable} ${merriweather.variable} dark scroll-smooth`}>
      <body 
        className="antialiased selection:bg-[#C19A6B] selection:text-black" 
        suppressHydrationWarning
      >
        <AccessibilityManager />
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}
