import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import AdminDashboard from './pages/AdminDashboard';
import AdminProjectForm from './pages/AdminProjectForm';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/new" element={<AdminProjectForm />} />
        <Route path="/admin/edit/:id" element={<AdminProjectForm />} />
      </Routes>
    </Router>
  );
}

export default App;
