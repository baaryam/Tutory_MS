import React from 'react'
import { BrowserRouter, Routes, Route, Link, Navigate } from 'react-router-dom'
import './App.css'
import { GraduationCap } from 'lucide-react'

// Import Pages
import { Home, Subjects, TimetablePreview, Contact, Login } from './pages/PublicPages'
import { AdminLayout, AdminDashboard } from './pages/AdminPages'
import { TeacherLayout } from './pages/TeacherPages'
import { StudentLayout } from './pages/StudentPages'

function PublicLayout({ children }) {
  const token = localStorage.getItem('token');
  const user = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null;

  return (
    <div className="app-container">
      <header className="navbar">
        <div className="logo">
          <GraduationCap color="#6c5ce7" size={32} />
          <span>TutoryMS</span>
        </div>
        <nav>
          <Link to="/home">Home</Link>
          <Link to="/subjects">Subjects</Link>
          <Link to="/schedule">Timetable</Link>
          <Link to="/contact">Contact</Link>
          {token && user ? (
            <Link 
              to={user.role === 'admin' ? '/admin' : user.role === 'teacher' ? '/teacher' : '/student'} 
              className="btn-primary"
            >
              Dashboard
            </Link>
          ) : (
            <Link to="/login" className="btn-primary">Sign In</Link>
          )}
        </nav>
      </header>
      <main className="main-content">
        {children}
      </main>
      <footer className="footer">
        <p>&copy; 2026 TutoryMS - High-Fidelity Academic & Financial Management System. All rights reserved.</p>
      </footer>
    </div>
  )
}

// Protected Route Guard
function ProtectedRoute({ children, allowedRoles }) {
  const token = localStorage.getItem('token');
  const user = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null;

  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<PublicLayout><Home /></PublicLayout>} />
        <Route path="/home" element={<PublicLayout><Home /></PublicLayout>} />
        <Route path="/subjects" element={<PublicLayout><Subjects /></PublicLayout>} />
        <Route path="/schedule" element={<PublicLayout><TimetablePreview /></PublicLayout>} />
        <Route path="/contact" element={<PublicLayout><Contact /></PublicLayout>} />
        <Route path="/login" element={<PublicLayout><Login /></PublicLayout>} />

        {/* Admin & Manager Routes */}
        <Route 
          path="/admin/*" 
          element={
            <ProtectedRoute allowedRoles={['admin', 'manager']}>
              <AdminLayout />
            </ProtectedRoute>
          } 
        />

        {/* Teacher Routes */}
        <Route 
          path="/teacher/*" 
          element={
            <ProtectedRoute allowedRoles={['teacher']}>
              <TeacherLayout />
            </ProtectedRoute>
          } 
        />

        {/* Student Routes */}
        <Route 
          path="/student/*" 
          element={
            <ProtectedRoute allowedRoles={['student']}>
              <StudentLayout />
            </ProtectedRoute>
          } 
        />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
