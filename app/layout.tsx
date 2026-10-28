import type { Metadata, Viewport } from 'next';
import { DM_Sans, Newsreader } from 'next/font/google';
import './globals.css';
import '../design/tokens.css';
import edition from '../content/current-edition.json';
import {generateSummary} from '../lib/edition-summary.mjs';

const sans = DM_Sans({ variable: '--font-sans', subsets: ['latin'] });
const serif = Newsreader({ variable: '--font-serif', subsets: ['latin'] });
const longSummary=generateSummary(edition).sentence;
const ogFile=`/og-${edition.edition_date}.png`,ogAlt=`TL;DR Macro market briefing for ${edition.edition_date}`;

export const metadata: Metadata = {
  metadataBase: new URL('https://tldrmacro.com'),
  title: 'TL;DR Macro | Market intelligence for everyone',
  description: longSummary,
  alternates: { canonical: '/' },
  icons: { icon: '/favicon.svg' },
  openGraph: { title: 'TL;DR Macro', description: longSummary, url: '/', siteName: 'TL;DR Macro', type: 'website', images: [{url:ogFile,width:1200,height:630,alt:ogAlt}] },
  twitter: { card: 'summary_large_image', title: 'TL;DR Macro', description: longSummary, images: [ogFile] },
};
export const viewport: Viewport = { themeColor: '#071824' };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body className={`${sans.variable} ${serif.variable}`}>{children}</body></html>;
}
