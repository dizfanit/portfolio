import Header from "../components/Header";
import About from "../components/About";
import Contact from "../components/Contact";
import Hero from "../components/Hero";
import Preloader from "../components/Preloader";
import Process from "../components/Process";
import SelectedCases from "../components/SelectedCases";
import Services from "../components/Services";
import SmoothSectionScroll from "../components/SmoothSectionScroll";

import { publishedCases } from "../lib/content-store";

export const dynamic = "force-dynamic";

export default async function Home() {
  const extraCases = (await publishedCases()).map(({slug,number,title,type,year,industry,description,category,favorite,cover,singleWork}) => ({slug,number,title,type,year,industry,description,category,favorite,cover,singleWork}));
  return (
    <>
      <Preloader />
      <Header />
      <SmoothSectionScroll />
      <main className="page-snap">
        <Hero />
        <About />
        <SelectedCases extraCases={extraCases} />
        <Services />
        <Process />
        <Contact />
      </main>
    </>
  );
}
