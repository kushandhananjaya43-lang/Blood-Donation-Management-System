import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/auth/Login';
import SignUp from './components/auth/SignUp';
import DonorDashboard from './components/donor/DonorDashboard'; // 1. Add this import

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/donor-dashboard" element={<DonorDashboard />} /> {/* 2. Add this route */}
      </Routes>
    </Router>
  );
}

export default App;