import { Routes, Route } from 'react-router-dom'
import Welcome from './pages/Welcome'
import Login from './pages/Login'
import Register from './pages/Register'
import MapPage from './pages/MapPage'
import Offers from './pages/Offers'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Welcome />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/map" element={<MapPage />} />
      <Route path="/offers" element={<Offers />} />
    </Routes>
  )
}

export default App