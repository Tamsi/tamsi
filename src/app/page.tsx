import { Navbar } from "@/components/sections/navbar";
import { Hero } from "@/components/sections/hero";
import { About } from "@/components/sections/about";
import { Experience } from "@/components/sections/experience";
import { Interests } from "@/components/sections/interests";
import { Projects } from "@/components/sections/projects";
import { BlogPreview } from "@/components/sections/blog-preview";
import { Contact } from "@/components/sections/contact";
import { JsonLd } from "@/components/seo/json-ld";
import { getServerLocale } from "@/i18n/locale.server";
import { buildStructuredDataGraph } from "@/lib/seo";

export default async function Home() {
  const locale = await getServerLocale();

  return (
    <>
      <JsonLd data={buildStructuredDataGraph(locale, "/")} />
      <Navbar />
      <main className="relative">
        <Hero />
        <About />
        <Experience />
        <Interests />
        <Projects />
        <BlogPreview />
        <Contact />
      </main>
    </>
  );
}
