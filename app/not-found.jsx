import Link from "next/link";
import { Header, Footer, Arrow } from "./interface";

export default function NotFound() {
  return (
    <div className="site-shell" id="top">
      <Header />
      <main id="main" className="case-file" tabIndex={-1}>
        <div className="contact-topline">
          <span className="hazard" />
          <span>LOOKUP FAILURE / 404</span>
        </div>
        <div className="case-heading">
          <h1>Record not found.</h1>
          <p>The page you requested could not be located.</p>
        </div>
        <div className="case-body">
          <Link className="action-link" href="/">
            RETURN TO COMMAND DECK <Arrow />
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
}
