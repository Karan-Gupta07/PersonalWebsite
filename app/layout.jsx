import {
  Barlow,
  Barlow_Condensed,
  IBM_Plex_Mono,
  Libre_Bodoni,
} from "next/font/google";
import "./globals.css";

const body = Barlow({
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
  variable: "--font-body",
});
const display = Libre_Bodoni({
  subsets: ["latin"],
  weight: "700",
  display: "swap",
  variable: "--font-display",
});
const condensed = Barlow_Condensed({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  variable: "--font-condensed",
});
const mono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
  variable: "--font-mono",
});

export const metadata = {
  title: {
    default: "Karan Gupta — Engineering Archive",
    template: "%s — Karan Gupta",
  },
  description:
    "Karan Gupta. Computer Engineering at the University of Waterloo. Software engineering, computer vision, automation, and the systems that connect them.",
  icons: { icon: "/mark.svg" },
  openGraph: {
    title: "Karan Gupta — Engineering Archive",
    description:
      "Software engineering, computer vision, and automation. Explore the projects and experience of Karan Gupta.",
    type: "website",
  },
};

export const viewport = { themeColor: "#090b09", colorScheme: "dark" };

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${body.variable} ${display.variable} ${condensed.variable} ${mono.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
