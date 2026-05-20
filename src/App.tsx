import { HashRouter, Routes, Route, useLocation } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CustomCursor from "@/components/CustomCursor";
import CoffeeBeanIntro from "@/components/CoffeeBeanIntro";
import ScrollToTop from "@/components/ScrollToTop";
import ErrorBoundary from "@/components/ErrorBoundary";
import { useLenis } from "@/hooks/useLenis";
import LandingPage from "@/pages/LandingPage";
import ShopsPage from "@/pages/ShopsPage";
import CoffeeMenuPage from "@/pages/CoffeeMenuPage";
import ComingSoonPage from "@/pages/ComingSoonPage";
import LocationsPage from "@/pages/LocationsPage";
import ContactPage from "@/pages/ContactPage";
import NotFound from "@/pages/NotFound";

const IntroGate = () => {
  const { pathname } = useLocation();
  if (pathname !== "/") return null;
  return <CoffeeBeanIntro />;
};

const AppShell = () => {
  useLenis();
  return (
    <>
      <IntroGate />
      <CustomCursor />
      <Navbar />
      <ScrollToTop />
      <main className="min-h-[60vh]">
        <ErrorBoundary>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/menu" element={<ShopsPage />} />
            <Route path="/menu/coffee" element={<CoffeeMenuPage />} />
            <Route path="/menu/brewery" element={<ComingSoonPage variant="brewery" />} />
            <Route path="/menu/bar" element={<ComingSoonPage variant="bar" />} />
            <Route path="/locations" element={<LocationsPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </ErrorBoundary>
      </main>
      <Footer />
    </>
  );
};

const App = () => (
  <HashRouter>
    <AppShell />
  </HashRouter>
);

export default App;
