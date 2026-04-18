import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import RequireAdmin from './components/RequireAdmin';
import Home from './pages/Home';
import SubmitFeedback from './pages/SubmitFeedback';
import Dashboard from './pages/Dashboard';
import Analytics from './pages/Analytics';
import AdminLogin from './pages/AdminLogin';
import AdminRegister from './pages/AdminRegister';

function App() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      <Navbar />
      <main className="container mx-auto px-4 py-8 flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/submit/:adminId" element={<SubmitFeedback />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/register" element={<AdminRegister />} />

          <Route
            path="/admin/dashboard"
            element={
              <RequireAdmin>
                <Dashboard />
              </RequireAdmin>
            }
          />

          <Route
            path="/admin/analytics"
            element={
              <RequireAdmin>
                <Analytics />
              </RequireAdmin>
            }
          />
        </Routes>
      </main>

      <footer className="w-full text-center py-6 text-sm text-gray-500 dark:text-gray-400 border-t border-gray-200 dark:border-gray-800 mt-auto">
        © 2026 FeedbackHub. All rights reserved. Turning feedback into growth.
      </footer>
    </div>
  );
}

export default App;