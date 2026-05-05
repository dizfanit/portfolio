import Header from "../components/Header";
import Hero from "../components/Hero";
import Preloader from "../components/Preloader";

export default function Home() {
  return (
    <>
      <Preloader />
      <Header />
      <main>
        <Hero />
      </main>
    </>
  );
}
