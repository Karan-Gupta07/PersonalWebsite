import Link from "next/link";
import { Header, Footer, Arrow } from "./interface";

export default function NotFound() {
  return (
    <div className="site-shell" id="top">
      <Header />
      <main id="main" className="not-found" tabIndex={-1}>
        <h1>Page not found.</h1>
        <p>That page isn’t here. Let’s get you back to the good stuff.</p>
        <Link className="back-link" href="/"><Arrow /> Back home</Link>
      </main>
      <Footer />
    </div>
  );
}
