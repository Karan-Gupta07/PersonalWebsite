import { Manrope } from "next/font/google";
import PixelFeedback from "./pixel-feedback";
import Scrollbar from "./scrollbar";
import "./globals.css";

const body = Manrope({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
  variable: "--font-body",
});

export const metadata = {
  title: {
    default: "Karan Gupta",
    template: "%s | Karan Gupta",
  },
  description:
    "Karan Gupta. Computer Engineering at the University of Waterloo. Building software, AI systems, and robots.",
  icons: { icon: "/mark.svg" },
  openGraph: {
    title: "Karan Gupta",
    description:
      "Computer Engineering at Waterloo. A few things I’ve built, where I’ve worked, and a little about me.",
    type: "website",
  },
};

export const viewport = { themeColor: "#0b0b0b", colorScheme: "dark" };

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={body.variable}>
      <body>{children}<PixelFeedback /><Scrollbar /></body>
    </html>
  );
}
