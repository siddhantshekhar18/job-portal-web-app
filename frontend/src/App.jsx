import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import JobsSection from "./components/JobsSection";

function App() {
  return (
    <div className="min-h-screen bg-white text-slate-950">
      <Navbar />

      <main>
        <Hero />
        <JobsSection />
      </main>
    </div>
  );
}

export default App;
