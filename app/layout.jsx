import '@/app/globals.css';

export const metadata = {
  title: 'Karan Gupta — Software Engineer',
  description: 'Personal website of Karan Gupta, software engineer specialized in robotics and web backend service integrations.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600&family=Space+Grotesk:wght@400;500;600;700&family=VT323&display=swap"
          rel="stylesheet"
        />
        <link rel="icon" href="/favicon.png" type="image/png" />
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
