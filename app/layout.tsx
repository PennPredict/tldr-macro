import type { Metadata, Viewport } from 'next';
import { DM_Sans, Newsreader } from 'next/font/google';
import './globals.css';

const sans = DM_Sans({ variable: '--font-sans', subsets: ['latin'] });
const serif = Newsreader({ variable: '--font-serif', subsets: ['latin'] });

export const metadata: Metadata = {
  metadataBase: new URL('https://tldrmacro.com'),
  title: 'TL;DR Macro | Market intelligence for everyone',
  description: 'Understand what moved, why it matters, and what comes next without a finance degree.',
  alternates: { canonical: '/' },
  icons: { icon: '/favicon.svg' },
  openGraph: { title: 'TL;DR Macro', description: 'Market intelligence for everyone.', url: '/', siteName: 'TL;DR Macro', type: 'website', images: [{url:'/og-2026-10-19.svg',width:1200,height:630,alt:'TL;DR Macro market briefing for October 19, 2026'}] },
  twitter: { card: 'summary_large_image', title: 'TL;DR Macro', description: 'Market intelligence for everyone.', images: ['/og-2026-10-19.svg'] },
};
export const viewport: Viewport = { themeColor: '#071824' };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body className={`${sans.variable} ${serif.variable}`}>{children}</body></html>;
}
