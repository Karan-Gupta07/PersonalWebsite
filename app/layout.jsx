import '@/app/globals.css';
import { Analytics } from '@vercel/analytics/react';

export const metadata = {
  title: 'KARAN GUPTA // PILOT-EXO',
  description: 'Personal website of Karan Gupta — Software Engineer, Computer Engineering + Economics @ University of Waterloo.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Serif+JP:wght@700;900&family=Shippori+Mincho+B1:wght@700;800&family=JetBrains+Mono:wght@400;700&family=Saira+Semi+Condensed:wght@600;700&family=Saira+Extra+Condensed:wght@700;900&display=swap"
          rel="stylesheet"
        />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
      </head>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
