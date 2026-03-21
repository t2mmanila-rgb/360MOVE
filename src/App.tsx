import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Programs from './pages/Programs';
import CorporateWellness from './pages/CorporateWellness';
import Events from './pages/Events';
import FitstreetEvent from './pages/FitstreetEvent';
import ActivityDetail from './pages/ActivityDetail';
import RequestProposal from './pages/RequestProposal';
import MyPass from './pages/MyPass';
import Rewards from './pages/Rewards';
import AdminDashboard from './pages/AdminDashboard';
import GenericDashboard from './pages/GenericDashboard';
import Register from './pages/Register';
import Schedule from './pages/Schedule';
import ScannerPage from './pages/ScannerPage';
import VIPUpgradeModal from './components/VIPUpgradeModal';

const App: React.FC = () => {
  return (
    <Router>
      <div className="min-h-screen flex flex-col font-sans">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/programs" element={<Programs />} />
            <Route path="/programs/corporate" element={<CorporateWellness />} />
            <Route path="/programs/:id" element={<ActivityDetail />} />
            <Route path="/request-proposal" element={<RequestProposal />} />
            <Route path="/events" element={<Events />} />
             <Route path="/events/fitstreet-2026" element={<FitstreetEvent />} />
            <Route path="/events/fitstreet-2026/schedule" element={<Schedule />} />
             <Route path="/activity/:id" element={<ActivityDetail />} />
             <Route path="/my-pass" element={<MyPass />} />
            <Route path="/rewards" element={<Rewards />} />
            <Route path="/admin-t2m" element={<AdminDashboard />} />
            <Route path="/dashboard" element={<GenericDashboard />} />
            <Route path="/register" element={<Register />} />
            <Route path="/scanner" element={<ScannerPage />} />
            <Route path="*" element={<Home />} />
          </Routes>
        </main>
        <Footer />
        <VIPUpgradeModal />
      </div>
    </Router>
  );
};

export default App;
