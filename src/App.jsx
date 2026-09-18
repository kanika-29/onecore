import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
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

import { AdminAuthProvider } from './context/AdminAuthContext';
import ProtectedRoute from './components/admin/ProtectedRoute';
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminEnquiries from './pages/admin/AdminEnquiries';
import AdminPages from './pages/admin/AdminPages';
import AdminPageEditor from './pages/admin/AdminPageEditor';
import AdminTherapeuticAreas from './pages/admin/AdminTherapeuticAreas';
import AdminProducts from './pages/admin/AdminProducts';
import AdminProductEditor from './pages/admin/AdminProductEditor';
import AdminNews from './pages/admin/AdminNews';
import AdminNewsEditor from './pages/admin/AdminNewsEditor';
import AdminMedia from './pages/admin/AdminMedia';
import AdminSettings from './pages/admin/AdminSettings';
import AdminUsers from './pages/admin/AdminUsers';

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
    return (
      <AdminAuthProvider>
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
            path="/admin/enquiries"
            element={
              <ProtectedRoute>
                <AdminEnquiries />
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
            path="/admin/therapeutic-areas"
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
          <Route path="/admin/*" element={<NotFound />} />
        </Routes>
      </AdminAuthProvider>
    );
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
    <BrowserRouter>
      <ScrollToTop />
      <AppRoutes />
    </BrowserRouter>
  );
}
