import Link from "next/link";
import { Header, Footer, ProjectArchive, Arrow } from "../interface";
import HomePreview from "../home-preview";

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
          <p>Software, AI, and robotics projects.</p>
        </header>
        <div className="archive-layout">
          <ProjectArchive />
          <div className="archive-preview-slot"><HomePreview root=".archive-layout" className="archive-preview" /></div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
