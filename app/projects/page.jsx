import Link from "next/link";
import { Header, Footer, ProjectArchive, Arrow } from "../interface";

export const metadata = {
  title: "Projects",
  description: "Software, AI, and robotics projects by Karan Gupta.",
};

export default function ProjectsPage() {
  return (
    <div className="site-shell" id="top">
      <Header />
      <main id="main" className="reading-page" tabIndex={-1}>
        <Link className="back-link" href="/#projects"><Arrow /> Back home</Link>
        <header className="project-heading">
          <h1>Things I’ve built.</h1>
          <p>A collection of work in software, AI, and robotics.</p>
        </header>
        <ProjectArchive />
      </main>
      <Footer />
    </div>
  );
}
