import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Footer } from "@/components/layout/footer";
import { NavBar } from "@/components/layout/navbar";
import { Landing } from "@/pages/landing";
import { About } from "@/pages/about";
import "./index.css";

export function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col">
        <NavBar />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/about" element={<About />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
