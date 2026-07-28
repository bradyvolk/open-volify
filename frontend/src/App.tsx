import { BrowserRouter } from "react-router-dom";
import { Routes, Route } from "react-router";
import { Footer } from "@/components/layout/footer";
import { TopNav } from "@/components/layout/top-nav/top-nav";
import { PlatformLayout } from "@/components/layout/platform-layout";
import { Landing } from "@/pages/landing";
import { About } from "@/pages/about";
import { SignIn } from "@/pages/sign-in";
import { SignUp } from "@/pages/sign-up";
import { Projects } from "@/pages/projects";
import { Organizations } from "@/pages/organizations";
import { PeoplePage } from "@/features/people/pages/people-page";
import { PeopleNewPage } from "@/features/people/pages/people-new-page";
import { PeopleDetailPage } from "@/features/people/pages/people-detail-page";
import { ProtectedRoute } from "@/components/auth/protected-route";
import "./index.css";

export function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col">
        <TopNav />
        <main className="flex-1 bg-gradient-to-tr from-primary/10 to-background min-h-screen">
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/about" element={<About />} />
            <Route path="/sign-in" element={<SignIn />} />
            <Route path="/sign-up" element={<SignUp />} />

            <Route element={<ProtectedRoute />}>
              <Route path="/platform" element={<PlatformLayout />}>
                <Route path="people" element={<PeoplePage />} />
                <Route path="people/new" element={<PeopleNewPage />} />
                <Route path="people/:id" element={<PeopleDetailPage />} />
                <Route path="projects" element={<Projects />} />
                <Route path="organizations" element={<Organizations />} />
              </Route>
            </Route>
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
