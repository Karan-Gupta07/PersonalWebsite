import { Header, Footer } from "../interface";
import Terminal from "./terminal";

export const metadata = {
  title: "The Karan Terminal",
  description: "A small terminal with a few commands. Type help.",
};

export default function TerminalPage() {
  return (
    <div className="site-shell" id="top">
      <Header />
      <main id="main" className="reading-page" tabIndex={-1}>
        <header className="project-heading">
          <h1>The Karan Terminal</h1>
          <p>A few commands, some favourites, nothing important. Type <code>help</code>.</p>
        </header>
        <Terminal />
      </main>
      <Footer />
    </div>
  );
}
