import Header from "../components/Header";
import About from "../components/About";
import Contact from "../components/Contact";
import Hero from "../components/Hero";
import Preloader from "../components/Preloader";
import Process from "../components/Process";
import SelectedCases from "../components/SelectedCases";
import Services from "../components/Services";

export default function Home() {
  return (
    <>
      <Preloader />
      <Header />
      <main>
        <Hero />
        <About />
        <SelectedCases />
        <Services />
        <Process />
        <Contact />
      </main>
    </>
  );
}
