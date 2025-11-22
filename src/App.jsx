import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Container } from 'react-bootstrap';

import Sidebar from './components/Sidebar';
import Header from './components/Header';
import HeaderNavPage from './pages/HeaderNavPage';
import FooterManager from './components/FooterManager';
import Dashboard from './components/Dashboard';
import ExtraPage from './pages/ExtraPage';
import Speakers from './pages/SpeakersPage';
import HeroSectionManager from './components/HeroSectionManager';
import AboutManager from './components/AboutManager';
import PaperManager from './components/PaperManager';
import CommitteeManager from './components/CommitteeManager';
import RegistrerManager from './components/RegisterManager';
import ImportantDates from './components/ImportantDatesManager';
import FaqEditor from './components/FAQEditor';

import AdminLogin from './pages/AdminLogin';
import AdminRegister from './pages/AdminRegister';
import AuthProvider from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

import './styles/Common.module.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/register" element={<AdminRegister />} />

          {/* Protected Dashboard */}
          <Route
            path="/*"
            element={
              <ProtectedRoute roles={['admin']}>
                <div className="dashboard-container">
                  <Sidebar />
                  <div className="main-content">
                    <Header />
                    <Container fluid className="content-wrapper">
                      <Routes>
                        <Route path="/" element={<Dashboard />} />
                        <Route path="/dashboard" element={<Dashboard />} />
                        <Route path="/about-content" element={<AboutManager />} />
                        <Route path="/paper-content" element={<PaperManager />} />
                        <Route path="/committee" element={<CommitteeManager />} />
                        <Route path="/faq-editor" element={<FaqEditor />} />
                        <Route path="/header-nav" element={<HeaderNavPage />} />
                        <Route path="/hero" element={<HeroSectionManager />} />
                        <Route path="/register" element={<RegistrerManager />} />
                        <Route path="/footer" element={<FooterManager />} />
                        <Route path="/speakers" element={<Speakers />} />
                        <Route path="/extra" element={<ExtraPage />} />
                        <Route path="/dates" element={<ImportantDates />} />
                        <Route path="/settings" element={<div>Settings Page</div>} />
                        <Route path="/logout" element={<Navigate to="/admin/login" replace />} />
                        <Route path="*" element={<Navigate to="/" replace />} />
                      </Routes>
                    </Container>
                  </div>
                </div>
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
