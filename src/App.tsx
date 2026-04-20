import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import FloatingCTA from "@/components/layout/FloatingCTA";
import ScrollToTop from "@/components/ScrollToTop";
import Index from "./pages/Index";
import Services from "./pages/Services";
import ServiceDetail from "./pages/ServiceDetail";
import ByState from "./pages/ByState";
import StatePage from "./pages/StatePage";
import BySubstance from "./pages/BySubstance";
import SubstancePage from "./pages/SubstancePage";
import AssetLibrary from "./pages/AssetLibrary";
import AssetDetail from "./pages/AssetDetail";
import About from "./pages/About";
import BookCall from "./pages/BookCall";
import Blog from "./pages/Blog";
import Contact from "./pages/Contact";
import DownloadPage from "./pages/Download";
import Unsubscribe from "./pages/Unsubscribe";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <ScrollToTop />
        <Header />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/services" element={<Services />} />
          <Route path="/services/:slug" element={<ServiceDetail />} />
          <Route path="/states" element={<ByState />} />
          <Route path="/states/:slug" element={<StatePage />} />
          <Route path="/substances" element={<BySubstance />} />
          <Route path="/substances/:slug" element={<SubstancePage />} />
          <Route path="/assets" element={<AssetLibrary />} />
          <Route path="/assets/:slug" element={<AssetDetail />} />
          <Route path="/about" element={<About />} />
          <Route path="/book" element={<BookCall />} />
          <Route path="/free-consultation" element={<BookCall />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/download" element={<DownloadPage />} />
          <Route path="/unsubscribe" element={<Unsubscribe />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Footer />
        <FloatingCTA />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
