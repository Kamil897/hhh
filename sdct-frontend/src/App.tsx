import { BrowserRouter, Routes, Route, Link, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import Store from './pages/Store';
import Games from './pages/Games';
import Cognia from './pages/Cognia';
import Admin from './pages/Admin';
import Report from './pages/Report';

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50 text-gray-900">
        <nav className="border-b bg-white">
          <div className="mx-auto max-w-4xl px-4 py-3 flex items-center justify-between">
            <Link to="/" className="font-semibold">StuDent-ChaT</Link>
            <div className="flex gap-3">
              <Link to="/profile" className="text-sm hover:underline">Profile</Link>
              <Link to="/store" className="text-sm hover:underline">Store</Link>
              <Link to="/games" className="text-sm hover:underline">Games</Link>
              <Link to="/cognia" className="text-sm hover:underline">Cognia</Link>
              <Link to="/admin" className="text-sm hover:underline">Admin</Link>
              <Link to="/report" className="text-sm hover:underline">Report</Link>
              <Link to="/login" className="text-sm hover:underline">Login</Link>
              <Link to="/register" className="text-sm hover:underline">Register</Link>
            </div>
          </div>
        </nav>
        <main className="mx-auto max-w-2xl p-4">
          <Routes>
            <Route path="/" element={<Navigate to="/profile" replace />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/store" element={<Store />} />
            <Route path="/games" element={<Games />} />
            <Route path="/cognia" element={<Cognia />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/report" element={<Report />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
