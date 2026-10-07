import Link from "next/link";
import { Header, Footer, Arrow } from "./interface";

export const metadata = { title: "YOU DIED" };

export default function NotFound() {
  return (
    <div className="site-shell" id="top">
      <Header />
      <main id="main" className="not-found" tabIndex={-1}>
        <div className="you-died">
          <h1>YOU DIED</h1>
          <p className="sr-only">404: this page does not exist.</p>
        </div>
        <div className="you-died-after">
          <p>404. This page doesn’t exist. Try again from the last site of grace.</p>
          <Link className="back-link" href="/"><Arrow /> Back home</Link>
        </div>
      </main>
      <Footer />
    </div>
  );
}
