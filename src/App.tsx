import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { supabase } from './lib/supabase';

import Login from './components/auth/Login';
import SignUp from './components/auth/SignUp';
import DonorDashboard from './components/donor/DonorDashboard';
import DonorProfileForm from './components/donor/DonorProfileForm';
import HospitalDashboard from './components/hospital/HospitalDashboard';
import BloodStock from './components/hospital/BloodStock';
import BloodRequestForm from './components/hospital/BloodRequestForm';
import CampaignDashboard from './components/campaign/CampaignDashboard';
import CreateCampaignForm from './components/campaign/CreateCampaignForm';
import CampaignList from './components/campaign/CampaignList';
import DashboardLayout from './components/layout/DashboardLayout';

function App() {
  useEffect(() => {
    const checkConnection = async () => {
      const { data, error } = await supabase.from('profiles').select('*');
      if (error) {
        console.error('Supabase connection error:', error.message);
      } else {
        console.log('Successfully connected to Supabase! Profiles:', data);
      }
    };

    checkConnection();
  }, []);

  return (
    <Router>
      <Routes>
        {/* Production Defaults */}
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        
        {/* Production Dashboard Routes with layouts */}
        <Route 
          path="/donor-dashboard" 
          element={
            <DashboardLayout userRole="donor">
              <DonorDashboard />
            </DashboardLayout>
          } 
        />
        <Route 
          path="/donor/profile" 
          element={
            <DashboardLayout userRole="donor">
              <DonorProfileForm />
            </DashboardLayout>
          } 
        />
        <Route 
          path="/hospital-dashboard" 
          element={
            <DashboardLayout userRole="hospital">
              <HospitalDashboard />
            </DashboardLayout>
          } 
        />
        <Route 
          path="/hospital/stock" 
          element={
            <DashboardLayout userRole="hospital">
              <BloodStock />
            </DashboardLayout>
          } 
        />
        <Route 
          path="/hospital/request" 
          element={
            <DashboardLayout userRole="hospital">
              <BloodRequestForm />
            </DashboardLayout>
          } 
        />
        <Route 
          path="/campaign-dashboard" 
          element={
            <DashboardLayout userRole="campaign">
              <CampaignDashboard />
            </DashboardLayout>
          } 
        />
        <Route 
          path="/campaign/create" 
          element={
            <DashboardLayout userRole="campaign">
              <CreateCampaignForm />
            </DashboardLayout>
          } 
        />
        <Route 
          path="/campaigns" 
          element={
            <DashboardLayout userRole="donor">
              <CampaignList />
            </DashboardLayout>
          } 
        />
      </Routes>
    </Router>
  );
}

export default App;