import React, { useEffect } from 'react';
import { HashRouter, Routes, Route, useLocation, Link } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import About from './pages/About';
import QualityManufacturing from './pages/QualityManufacturing';
import PatientsCaregivers from './pages/PatientsCaregivers';
import AreasOfCare from './pages/AreasOfCare';
import AreaOfCareDetail from './pages/AreaOfCareDetail';
import FemmeProductDetail from './pages/FemmeProductDetail';
import PediatricsProductDetail from './pages/PediatricsProductDetail';
import OrthopaedicsProductDetail from './pages/OrthopaedicsProductDetail';
import NeurologyProductDetail from './pages/NeurologyProductDetail';
import OphthalmologyProductDetail from './pages/OphthalmologyProductDetail';
import DermatologyProductDetail from './pages/DermatologyProductDetail';
import EntProductDetail from './pages/EntProductDetail';
import GeneralMedicineProductDetail from './pages/GeneralMedicineProductDetail';
import ProductOneFlexo from './pages/ProductOneFlexo';
import News from './pages/News';
import Contact from './pages/Contact';
import Privacy from './pages/Privacy';
import Disclaimer from './pages/Disclaimer';
import NotFound from './pages/NotFound';

function AdminStaticNotice() {
  return (
    <div className="min-h-screen bg-[#141A17] flex flex-col items-center justify-center p-6 text-center text-white">
      <div className="max-w-md bg-white/5 border border-white/10 p-8 rounded-xl space-y-4 backdrop-blur-md">
        <span className="text-xs uppercase tracking-widest text-[#B5C9BE] font-semibold">ONECORE PHARMA</span>
        <h2 className="text-2xl font-serif font-medium text-white">Static Mode Active</h2>
        <p className="text-sm text-gray-300 leading-relaxed">
          The website is running in decoupled static mode on GitHub Pages. All portfolio products, therapeutic areas, and company content are statically served without backend dependencies.
        </p>
        <div className="pt-2">
          <Link
            to="/"
            className="inline-block px-6 py-2.5 bg-[#8DA596] text-[#141A17] font-semibold text-xs uppercase tracking-wider rounded-sm hover:bg-[#A3B8AC] transition-colors"
          >
            ← Return to Website
          </Link>
        </div>
      </div>
    </div>
  );
}

function ScrollToTop() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      const element = document.getElementById(hash.replace('#', ''));
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }
    } else {
      window.scrollTo(0, 0);
    }
  }, [pathname, hash]);

  return null;
}

function AppRoutes() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  if (isAdminRoute) {
    return <AdminStaticNotice />;
  }

  return (
    <div className="flex flex-col min-h-screen bg-brand-ivory text-brand-text">
      <Navbar />
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/quality-manufacturing" element={<QualityManufacturing />} />
          <Route path="/patients-caregivers" element={<PatientsCaregivers />} />
          <Route path="/areas-of-care" element={<AreasOfCare />} />
          <Route path="/areas-of-care/femme/:productSlug" element={<FemmeProductDetail />} />
          <Route path="/areas-of-care/pediaplus/:productSlug" element={<PediatricsProductDetail />} />
          <Route path="/areas-of-care/pediatrics/:productSlug" element={<PediatricsProductDetail />} />
          <Route path="/areas-of-care/paediatrics/:productSlug" element={<PediatricsProductDetail />} />
          <Route path="/areas-of-care/ortheon/:productSlug" element={<OrthopaedicsProductDetail />} />
          <Route path="/areas-of-care/orthopaedics/:productSlug" element={<OrthopaedicsProductDetail />} />
          <Route path="/areas-of-care/orthopedic/:productSlug" element={<OrthopaedicsProductDetail />} />
          <Route path="/areas-of-care/orthopedics/:productSlug" element={<OrthopaedicsProductDetail />} />
          <Route path="/areas-of-care/neurix/:productSlug" element={<NeurologyProductDetail />} />
          <Route path="/areas-of-care/neurology/:productSlug" element={<NeurologyProductDetail />} />
          <Route path="/areas-of-care/neuro/:productSlug" element={<NeurologyProductDetail />} />
          <Route path="/areas-of-care/eyerix/:productSlug" element={<OphthalmologyProductDetail />} />
          <Route path="/areas-of-care/ophthalmology/:productSlug" element={<OphthalmologyProductDetail />} />
          <Route path="/areas-of-care/ocular/:productSlug" element={<OphthalmologyProductDetail />} />
          <Route path="/areas-of-care/eye-care/:productSlug" element={<OphthalmologyProductDetail />} />
          <Route path="/areas-of-care/vellis/:productSlug" element={<DermatologyProductDetail />} />
          <Route path="/areas-of-care/dermatology/:productSlug" element={<DermatologyProductDetail />} />
          <Route path="/areas-of-care/derma/:productSlug" element={<DermatologyProductDetail />} />
          <Route path="/areas-of-care/skin/:productSlug" element={<DermatologyProductDetail />} />
          <Route path="/areas-of-care/otira/:productSlug" element={<EntProductDetail />} />
          <Route path="/areas-of-care/ent/:productSlug" element={<EntProductDetail />} />
          <Route path="/areas-of-care/ear-nose-throat/:productSlug" element={<EntProductDetail />} />
          <Route path="/areas-of-care/omnara/:productSlug" element={<GeneralMedicineProductDetail />} />
          <Route path="/areas-of-care/general-medicine/:productSlug" element={<GeneralMedicineProductDetail />} />
          <Route path="/areas-of-care/general/:productSlug" element={<GeneralMedicineProductDetail />} />
          <Route path="/areas-of-care/internal-medicine/:productSlug" element={<GeneralMedicineProductDetail />} />
          <Route path="/areas-of-care/:slug" element={<AreaOfCareDetail />} />
          <Route path="/areas-of-care/orthopaedics/oneflexo" element={<ProductOneFlexo />} />
          <Route path="/news" element={<News />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/disclaimer" element={<Disclaimer />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <HashRouter>
      <ScrollToTop />
      <AppRoutes />
    </HashRouter>
  );
}

