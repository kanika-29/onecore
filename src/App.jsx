import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation, useNavigate, Link, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import CookieConsentBanner from './components/CookieConsentBanner';
import TechnicalGridBackground from './components/TechnicalGridBackground';
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
import OncologyProductDetail from './pages/OncologyProductDetail';
import ProductOneFlexo from './pages/ProductOneFlexo';
import News from './pages/News';
import NewsDetail from './pages/NewsDetail';
import Contact from './pages/Contact';
import DistributionPartnerships from './pages/DistributionPartnerships';
import Privacy from './pages/Privacy';
import Disclaimer from './pages/Disclaimer';
import NotFound from './pages/NotFound';
import ErrorBoundary from './components/ErrorBoundary';

// Admin Context & Components
import { AdminAuthProvider } from './context/AdminAuthContext';
import ProtectedRoute from './components/admin/ProtectedRoute';
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminPages from './pages/admin/AdminPages';
import AdminPageEditor from './pages/admin/AdminPageEditor';
import AdminTherapeuticAreas from './pages/admin/AdminTherapeuticAreas';
import AdminProducts from './pages/admin/AdminProducts';
import AdminProductEditor from './pages/admin/AdminProductEditor';
import AdminNews from './pages/admin/AdminNews';
import AdminNewsEditor from './pages/admin/AdminNewsEditor';
import AdminMedia from './pages/admin/AdminMedia';
import AdminEnquiries from './pages/admin/AdminEnquiries';
import AdminSettings from './pages/admin/AdminSettings';
import AdminUsers from './pages/admin/AdminUsers';

import ProductDetailDispatcher from './components/ProductDetailDispatcher';

function HashRedirect() {
  const navigate = useNavigate();

  useEffect(() => {
    if (window.location.hash && window.location.hash.startsWith('#/')) {
      const cleanPath = window.location.hash.slice(1);
      navigate(cleanPath, { replace: true });
    }
  }, [navigate]);

  return null;
}

function ScrollToTop() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash && !hash.startsWith('#/')) {
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

function AdminRoutes() {
  return (
    <Routes>
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/pages"
        element={
          <ProtectedRoute>
            <AdminPages />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/pages/:pageKey"
        element={
          <ProtectedRoute>
            <AdminPageEditor />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/areas-of-care"
        element={
          <ProtectedRoute>
            <AdminTherapeuticAreas />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/products"
        element={
          <ProtectedRoute>
            <AdminProducts />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/products/:id"
        element={
          <ProtectedRoute>
            <AdminProductEditor />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/news"
        element={
          <ProtectedRoute>
            <AdminNews />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/news/:id"
        element={
          <ProtectedRoute>
            <AdminNewsEditor />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/media"
        element={
          <ProtectedRoute>
            <AdminMedia />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/enquiries"
        element={
          <ProtectedRoute>
            <AdminEnquiries />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/settings"
        element={
          <ProtectedRoute allowedRoles={['Super Admin', 'Admin']}>
            <AdminSettings />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/users"
        element={
          <ProtectedRoute allowedRoles={['Super Admin']}>
            <AdminUsers />
          </ProtectedRoute>
        }
      />
      <Route path="/admin/*" element={<Navigate to="/admin" replace />} />
    </Routes>
  );
}

function PublicRoutes() {
  return (
    <div className="flex flex-col min-h-screen bg-[#FAF9F6] text-[#121212] relative isolate">
      {/* Global Precision Technical Blueprint & Cutting-Mat Grid Background */}
      <TechnicalGridBackground />
      
      <div className="relative z-10 flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/quality-manufacturing" element={<QualityManufacturing />} />
            <Route path="/patients-caregivers" element={<PatientsCaregivers />} />
            <Route path="/areas-of-care" element={<AreasOfCare />} />
            <Route path="/areas-of-care/femme/:productSlug" element={<FemmeProductDetail />} />
            <Route path="/areas-of-care/womens-health/:productSlug" element={<FemmeProductDetail />} />
            <Route path="/areas-of-care/women-health/:productSlug" element={<FemmeProductDetail />} />
            <Route path="/areas-of-care/pediaplus/:productSlug" element={<PediatricsProductDetail />} />
            <Route path="/areas-of-care/pediatrics/:productSlug" element={<PediatricsProductDetail />} />
            <Route path="/areas-of-care/paediatrics/:productSlug" element={<PediatricsProductDetail />} />
            <Route path="/areas-of-care/ortheon/oneflexo" element={<ProductOneFlexo />} />
            <Route path="/areas-of-care/orthopaedics/oneflexo" element={<ProductOneFlexo />} />
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
            <Route path="/areas-of-care/cytos/:productSlug" element={<OncologyProductDetail />} />
            <Route path="/areas-of-care/oncology/:productSlug" element={<OncologyProductDetail />} />
            <Route path="/areas-of-care/cancer-care/:productSlug" element={<OncologyProductDetail />} />
            <Route path="/areas-of-care/:divisionSlug/:productSlug" element={<ProductDetailDispatcher />} />
            <Route path="/areas-of-care/:slug" element={<AreaOfCareDetail />} />
            <Route path="/news" element={<News />} />
            <Route path="/news/:slug" element={<NewsDetail />} />
            <Route path="/partnerships" element={<DistributionPartnerships />} />
            <Route path="/distribution-partnerships" element={<DistributionPartnerships />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/disclaimer" element={<Disclaimer />} />

            {/* Section anchor fallbacks */}
            <Route path="/principles" element={<Navigate to="/quality-manufacturing#principles" replace />} />
            <Route path="/partner-form" element={<Navigate to="/partnerships#partner-form" replace />} />
            <Route path="/enquiry-form" element={<Navigate to="/contact#enquiry-form" replace />} />
            <Route path="/contact-details" element={<Navigate to="/contact#contact-details" replace />} />
            <Route path="/for-patients" element={<Navigate to="/patients-caregivers#for-patients" replace />} />
            <Route path="/for-professionals" element={<Navigate to="/patients-caregivers#for-professionals" replace />} />
            <Route path="/patient-safety" element={<Navigate to="/patients-caregivers#patient-safety" replace />} />

            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <Footer />
        <CookieConsentBanner />
      </div>
    </div>
  );
}

function AppRoutes() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  if (isAdminRoute) {
    return <AdminRoutes />;
  }

  return <PublicRoutes />;
}

export default function App() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <AdminAuthProvider>
        <HashRedirect />
        <ScrollToTop />
        <ErrorBoundary>
          <AppRoutes />
        </ErrorBoundary>
      </AdminAuthProvider>
    </BrowserRouter>
  );
}
