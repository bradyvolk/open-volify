import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Footer } from "@/components/layout/footer";
import { NavBar } from "@/components/layout/navbar";
import { Landing } from "@/pages/landing";
import { About } from "@/pages/about";
import { SignIn } from "@/pages/sign-in";
import { SignUp } from "@/pages/sign-up";
import "./index.css";

export function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col">
        <NavBar />
        <main className="flex-1 bg-gradient-to-tr from-primary/10 to-background min-h-screen">
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/about" element={<About />} />
            <Route path="/sign-in" element={<SignIn />} />
            <Route path="/sign-up" element={<SignUp />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
