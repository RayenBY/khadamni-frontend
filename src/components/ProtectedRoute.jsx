import { Navigate } from 'react-router-dom'
import { useAuth } from '../store/AuthContext'

/**
 * Wraps a route and redirects if the user is not authenticated.
 * If `role` is provided, also redirects unless the user has that role (admins always pass).
 */
export default function ProtectedRoute({ children, role }) {
  const { user, token } = useAuth()

  if (!token || !user) return <Navigate to="/login" replace />
  if (role && user.role !== role && user.role !== 'admin') return <Navigate to="/" replace />

  return children
}
