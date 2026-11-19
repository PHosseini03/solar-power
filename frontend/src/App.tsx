import { Route, Routes } from "react-router-dom";
import { Navbar } from "./components/Navbar";
import { Footer } from "./components/Footer";
import { ScrollToTop } from "./components/ScrollToTop";
import { ToastProvider } from "./components/Toast";
import Home from "./pages/Home";
import Solutions from "./pages/Solutions";
import Calculator from "./pages/Calculator";
import Projects from "./pages/Projects";
import Quote from "./pages/Quote";
import NotFound from "./pages/NotFound";

export default function App() {
  return (
    <ToastProvider>
      <ScrollToTop />
      <Navbar />
      <main id="main">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/solutions" element={<Solutions />} />
          <Route path="/calculator" element={<Calculator />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/quote" element={<Quote />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </ToastProvider>
  );
}
