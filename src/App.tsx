import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/auth/Login';
import SignUp from './components/auth/SignUp';
import DonorDashboard from './components/donor/DonorDashboard';
import HospitalDashboard from './components/hospital/HospitalDashboard';
import DashboardLayout from './components/layout/DashboardLayout';

function App() {
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
          path="/hospital-dashboard" 
          element={
            <DashboardLayout userRole="hospital">
              <HospitalDashboard />
            </DashboardLayout>
          } 
        />
      </Routes>
    </Router>
  );
}

export default App;