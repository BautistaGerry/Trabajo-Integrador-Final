import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import Navbar from './components/Navbar'
import PrivateRoute from './components/PrivateRoute'

import EventsPage from './pages/EventsPage'
import EventDetailPage from './pages/EventDetailPage'
import MyEventsPage from './pages/MyEventsPage'
import CategoriesPage from './pages/CategoriesPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import ForgotPasswordPage from './pages/ForgotPasswordPage'
import ResetPasswordPage from './pages/ResetPasswordPage'

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<EventsPage />} />
          <Route path="/events/:id" element={<EventDetailPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />

          { }
          <Route path="/my-events" element={<PrivateRoute><MyEventsPage /></PrivateRoute>} />
          <Route path="/categories" element={<PrivateRoute><CategoriesPage /></PrivateRoute>} />

          { }
          <Route path="*" element={
            <div className="container" style={{ textAlign: 'center', padding: '6rem 1rem' }}>
              <h1 style={{ fontSize: '4rem', fontWeight: 900 }}>404</h1>
              <p style={{ color: 'var(--color-text-muted)' }}>Página no encontrada</p>
            </div>
          } />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}
