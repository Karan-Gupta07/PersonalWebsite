import '@/app/globals.css';
import { meta } from '@/content/site';

export const metadata = {
  title: `${meta.name} — ${meta.title}`,
  description: `${meta.name}. ${meta.school}. AI agents, computer vision, automation.`,
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preload" href="/fonts/newsreader-var.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
        <link rel="preload" href="/fonts/plex-mono-medium.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
        <link rel="icon" href="/favicon.png" type="image/png" />
      </head>
      <body>{children}</body>
    </html>
  );
}
