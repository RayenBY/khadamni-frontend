import { Routes, Route, Navigate } from 'react-router-dom'
import ProtectedRoute from './components/ProtectedRoute'
import { useAuth } from './store/AuthContext'

// Public pages
import Welcome from './pages/Welcome'
import Login from './pages/Login'
import Register from './pages/Register'
import MapPage from './pages/MapPage'
import Offers from './pages/Offers'
import OfferDetail from './pages/OfferDetail'
import Workers from './pages/Workers'
import PublicProfile from './pages/PublicProfile'

// Authenticated pages
import Dashboard from './pages/Dashboard'
import Profile from './pages/Profile'
import Messages from './pages/Messages'
import Chat from './pages/Chat'

// Role-specific pages
import PostOffer from './pages/PostOffer'
import PostWorkerProfile from './pages/PostWorkerProfile'

// Admin
import AdminDashboard from './pages/AdminDashboard'

function GuestRoute({ children }) {
  const { token } = useAuth()
  return token ? <Navigate to="/dashboard" replace /> : children
}

function App() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/" element={<Welcome />} />
      <Route path="/login" element={<GuestRoute><Login /></GuestRoute>} />
      <Route path="/register" element={<GuestRoute><Register /></GuestRoute>} />
      <Route path="/offers" element={<Offers />} />
      <Route path="/offers/:id" element={<OfferDetail />} />
      <Route path="/workers" element={<Workers />} />
      <Route path="/user/:id" element={<PublicProfile />} />

      {/* Protected: any authenticated user */}
      <Route path="/map" element={
        <ProtectedRoute><MapPage /></ProtectedRoute>
      } />
      <Route path="/dashboard" element={
        <ProtectedRoute><Dashboard /></ProtectedRoute>
      } />
      <Route path="/profile" element={
        <ProtectedRoute><Profile /></ProtectedRoute>
      } />
      <Route path="/messages" element={
        <ProtectedRoute><Messages /></ProtectedRoute>
      } />
      <Route path="/messages/:id" element={
        <ProtectedRoute><Chat /></ProtectedRoute>
      } />

      {/* Employer only */}
      <Route path="/post-offer" element={
        <ProtectedRoute role="employer"><PostOffer /></ProtectedRoute>
      } />

      {/* Worker only */}
      <Route path="/post-worker-profile" element={
        <ProtectedRoute role="worker"><PostWorkerProfile /></ProtectedRoute>
      } />

      {/* Admin only */}
      <Route path="/admin" element={
        <ProtectedRoute role="admin"><AdminDashboard /></ProtectedRoute>
      } />
    </Routes>
  )
}

export default App
