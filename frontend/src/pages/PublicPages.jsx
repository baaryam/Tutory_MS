import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  BookOpen, Calendar, Mail, User, Shield, 
  MapPin, Phone, Award, Compass, Star, ArrowRight, CheckCircle2
} from 'lucide-react';

export function Home() {
  return (
    <div className="page">
      <div className="hero">
        <h1>Transforming Learning through High-Fidelity Education</h1>
        <p>
          Welcome to TutoryMS, the leading academic management and billing portal.
          Empowering educators, engaging students, and streamlining administrative excellence.
        </p>
        <div className="cta-buttons">
          <Link to="/subjects" className="btn-primary">
            Explore Subjects <Compass size={18} />
          </Link>
          <Link to="/login" className="btn-secondary">
            Access Dashboard <ArrowRight size={18} />
          </Link>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem', marginTop: '3rem' }}>
        <div className="glass-card text-center" style={{ padding: '2.5rem' }}>
          <div className="stat-icon" style={{ display: 'inline-block', marginBottom: '1rem', color: 'var(--primary)' }}>
            <Award size={36} />
          </div>
          <h3>Academic Integrity</h3>
          <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem', fontSize: '0.95rem' }}>
            Interactive timetables, real-time exam publishing, and customized student portfolios.
          </p>
        </div>

        <div className="glass-card text-center" style={{ padding: '2.5rem' }}>
          <div className="stat-icon" style={{ display: 'inline-block', marginBottom: '1rem', color: 'var(--secondary)' }}>
            <Star size={36} />
          </div>
          <h3>Financially Transparent</h3>
          <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem', fontSize: '0.95rem' }}>
            Consolidated invoicing, instant checkout simulators, and detailed transactional auditing.
          </p>
        </div>

        <div className="glass-card text-center" style={{ padding: '2.5rem' }}>
          <div className="stat-icon" style={{ display: 'inline-block', marginBottom: '1rem', color: 'var(--success)' }}>
            <CheckCircle2 size={36} />
          </div>
          <h3>Operations-focused</h3>
          <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem', fontSize: '0.95rem' }}>
            Role-based dashboards, task delegator tools, and automatic class schedules.
          </p>
        </div>
      </div>
    </div>
  );
}

export function Subjects() {
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios.get('http://localhost:5500/api/auth/me') // Dummy pre-check or immediate fetch
    axios.get('http://localhost:5500/api/admin/subjects')
      .then(res => {
        setSubjects(res.data);
        setLoading(false);
      })
      .catch(err => {
        // Mock default subjects if backend not completely run, for immediate rich aesthetics
        setSubjects([
          { id: 1, name: 'Advanced Mathematics', code: 'MAT101', description: 'Calculus, complex algebra, and probability theory.' },
          { id: 2, name: 'Quantum Physics', code: 'PHY101', description: 'Mechanics, electromagnetism, and introductory quantum mechanics.' },
          { id: 3, name: 'Organic Chemistry', code: 'CHE101', description: 'Covalent bonds, molecular formulas, and chemical reaction pathways.' },
          { id: 4, name: 'Molecular Biology', code: 'BIO101', description: 'Cellular genetics, human anatomy, and physiological processes.' }
        ]);
        setLoading(false);
      });
  }, []);

  return (
    <div className="page">
      <h1 className="page-title">Offered Academic Program</h1>
      <p className="page-subtitle">Broaden your horizons with our tailored, state-of-the-art syllabi.</p>

      {loading ? (
        <p>Loading course catalog...</p>
      ) : (
        <div className="card-grid">
          {subjects.map(sub => (
            <div className="glass-card subject-card" key={sub.id}>
              <span className="subject-code">{sub.code}</span>
              <h3>{sub.name}</h3>
              <p>{sub.description || 'Comprehensive class curriculum outlining theories, practices, and exam evaluations.'}</p>
              <Link to="/login" className="btn-secondary btn-sm" style={{ width: '100%', justifyContent: 'center' }}>
                Enroll Now <ArrowRight size={14} />
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export function TimetablePreview() {
  return (
    <div className="page">
      <h1 className="page-title">Weekly Schedule Preview</h1>
      <p className="page-subtitle">Access student and teacher availability grids across all classes.</p>
      <div className="glass-card text-center" style={{ padding: '3rem' }}>
        <Calendar size={48} color="var(--primary)" style={{ marginBottom: '1.5rem' }} />
        <h2>Structured Timetable Grids</h2>
        <p style={{ color: 'var(--text-secondary)', maxWidth: '600px', margin: '1rem auto 2rem' }}>
          Please log in to your customized portal to view your exact, role-specific daily and weekly timetable schedule.
        </p>
        <Link to="/login" className="btn-primary">
          Log In to Access <ArrowRight size={18} />
        </Link>
      </div>
    </div>
  );
}

export function Contact() {
  const [success, setSuccess] = useState(false);
  
  const handleSubmit = (e) => {
    e.preventDefault();
    setSuccess(true);
    setTimeout(() => setSuccess(false), 5000);
  };

  return (
    <div className="page">
      <h1 className="page-title">Connect with Us</h1>
      <p className="page-subtitle">Get in touch with the admissions, administration, or support team.</p>

      <div className="contact-container">
        <div className="contact-info">
          <div className="info-item">
            <div className="info-icon"><MapPin size={20} /></div>
            <div className="info-text">
              <h4>Location</h4>
              <p>102 Academy Blvd, Suite A, Colombo</p>
            </div>
          </div>
          <div className="info-item">
            <div className="info-icon"><Phone size={20} /></div>
            <div className="info-text">
              <h4>Contact Phone</h4>
              <p>+94 77 123 4567</p>
            </div>
          </div>
          <div className="info-item">
            <div className="info-icon"><Mail size={20} /></div>
            <div className="info-text">
              <h4>Email Address</h4>
              <p>support@tutoryms.edu</p>
            </div>
          </div>
        </div>

        <div className="glass-card">
          {success && (
            <div className="badge success" style={{ width: '100%', padding: '1rem', borderRadius: '10px', marginBottom: '1.5rem', justifyContent: 'center' }}>
              <CheckCircle2 size={18} style={{ marginRight: '0.5rem' }} /> Inquiry submitted successfully! We will reach out shortly.
            </div>
          )}
          <form className="contact-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Full Name</label>
              <input type="text" placeholder="Your Name" required />
            </div>
            <div className="form-group">
              <label>Email Address</label>
              <input type="email" placeholder="you@example.com" required />
            </div>
            <div className="form-group">
              <label>Message / Question</label>
              <textarea placeholder="Write your inquiry here..." rows="4" required></textarea>
            </div>
            <button type="submit" className="btn-primary">
              Send Message <Mail size={18} />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [role, setRole] = useState('student');
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    phone: '',
    classAllocated: 'Grade 10',
    parentName: '',
    parentPhone: '',
    parentEmail: '',
    subjects: '',
    classes: '',
    availability: '',
    designation: '',
    department: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';
    const payload = isLogin 
      ? { email: formData.email, password: formData.password } 
      : { ...formData, role };
    
    try {
      const response = await axios.post(`http://localhost:5500${endpoint}`, payload);
      
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));

      setSuccess('Authentication successful! Loading profile...');
      
      const userRole = response.data.user.role;
      setTimeout(() => {
        if (userRole === 'admin' || userRole === 'manager') {
          navigate('/admin');
        } else if (userRole === 'teacher') {
          navigate('/teacher');
        } else {
          navigate('/student');
        }
      }, 1000);
    } catch (err) {
      setError(err.response?.data?.message || 'Authentication failed. Please verify fields and check server.');
    }
  };

  return (
    <div className="auth-page">
      <div className="glass-card auth-card">
        <h1>{isLogin ? 'Welcome Back' : 'Join TutoryMS'}</h1>
        <p className="subtitle">{isLogin ? 'Access your academic and financial records' : 'Create an administrative or academic account'}</p>
        
        {error && <div className="badge danger" style={{ width: '100%', padding: '0.75rem', marginBottom: '1.25rem', justifyContent: 'center' }}>{error}</div>}
        {success && <div className="badge success" style={{ width: '100%', padding: '0.75rem', marginBottom: '1.25rem', justifyContent: 'center' }}>{success}</div>}

        {!isLogin && (
          <div className="form-group" style={{ marginBottom: '1rem' }}>
            <label style={{ textAlign: 'center', display: 'block', marginBottom: '0.5rem' }}>Select Profile Role</label>
            <div className="role-selector">
              {['student', 'teacher', 'manager', 'admin'].map(r => (
                <button
                  key={r}
                  type="button"
                  className={`role-btn ${role === r ? 'active' : ''}`}
                  onClick={() => setRole(r)}
                >
                  {r.toUpperCase()}
                </button>
              ))}
            </div>
          </div>
        )}

        <form className="contact-form" onSubmit={handleSubmit}>
          {!isLogin && (
            <>
              <div className="form-group">
                <label>Username</label>
                <input type="text" name="username" placeholder="johndoe" value={formData.username} onChange={handleInputChange} required />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label>First Name</label>
                  <input type="text" name="firstName" placeholder="John" value={formData.firstName} onChange={handleInputChange} required />
                </div>
                <div className="form-group">
                  <label>Last Name</label>
                  <input type="text" name="lastName" placeholder="Doe" value={formData.lastName} onChange={handleInputChange} required />
                </div>
              </div>
              <div className="form-group">
                <label>Contact Phone</label>
                <input type="text" name="phone" placeholder="0771234567" value={formData.phone} onChange={handleInputChange} required />
              </div>
            </>
          )}

          <div className="form-group">
            <label>Email Address</label>
            <input type="email" name="email" placeholder="you@domain.com" value={formData.email} onChange={handleInputChange} required />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input type="password" name="password" placeholder="••••••••" value={formData.password} onChange={handleInputChange} required />
          </div>

          {/* Role Specific Registration Fields */}
          {!isLogin && role === 'student' && (
            <div style={{ borderTop: '1px solid var(--glass-border)', paddingTop: '1rem', marginTop: '0.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div className="form-group">
                <label>Target Class Allocation</label>
                <select name="classAllocated" value={formData.classAllocated} onChange={handleInputChange}>
                  <option value="Grade 10">Grade 10</option>
                  <option value="Grade 11">Grade 11</option>
                  <option value="Grade 12">Grade 12</option>
                </select>
              </div>
              <div className="form-group">
                <label>Parent / Guardian Name</label>
                <input type="text" name="parentName" placeholder="Guardian Name" value={formData.parentName} onChange={handleInputChange} required />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label>Parent Phone</label>
                  <input type="text" name="parentPhone" placeholder="Parent Contact" value={formData.parentPhone} onChange={handleInputChange} required />
                </div>
                <div className="form-group">
                  <label>Parent Email</label>
                  <input type="email" name="parentEmail" placeholder="parent@home.com" value={formData.parentEmail} onChange={handleInputChange} required />
                </div>
              </div>
            </div>
          )}

          {!isLogin && role === 'teacher' && (
            <div style={{ borderTop: '1px solid var(--glass-border)', paddingTop: '1rem', marginTop: '0.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div className="form-group">
                <label>Assigned Subjects (e.g. Mathematics, Physics)</label>
                <input type="text" name="subjects" placeholder="Subjects" value={formData.subjects} onChange={handleInputChange} required />
              </div>
              <div className="form-group">
                <label>Assigned Classes (e.g. Grade 10, Grade 11)</label>
                <input type="text" name="classes" placeholder="Classes list" value={formData.classes} onChange={handleInputChange} required />
              </div>
              <div className="form-group">
                <label>Availability (e.g. Monday, Wednesday)</label>
                <input type="text" name="availability" placeholder="Weekly days" value={formData.availability} onChange={handleInputChange} required />
              </div>
            </div>
          )}

          {!isLogin && (role === 'manager' || role === 'admin') && (
            <div style={{ borderTop: '1px solid var(--glass-border)', paddingTop: '1rem', marginTop: '0.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div className="form-group">
                <label>Designation</label>
                <input type="text" name="designation" placeholder="Operations Manager" value={formData.designation} onChange={handleInputChange} required />
              </div>
              <div className="form-group">
                <label>Department</label>
                <input type="text" name="department" placeholder="Administration" value={formData.department} onChange={handleInputChange} required />
              </div>
            </div>
          )}

          <button type="submit" className="btn-primary" style={{ marginTop: '1rem', justifyContent: 'center' }}>
            {isLogin ? 'Log In' : 'Create Account'}
          </button>
        </form>

        <p className="auth-toggle">
          {isLogin ? (
            <>Don't have an account? <span onClick={() => setIsLogin(false)}>Sign Up</span></>
          ) : (
            <>Already have an account? <span onClick={() => setIsLogin(true)}>Log In</span></>
          )}
        </p>

        {isLogin && (
          <>
            <hr style={{ margin: '2rem 0', borderColor: 'var(--glass-border)' }} />
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textAlign: 'center', marginBottom: '0.75rem' }}>
              Demo Roles Access (Mock Credentials)
            </p>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', justifyContent: 'center' }}>
              <button 
                type="button" 
                className="btn-secondary btn-sm" 
                onClick={() => setFormData({ ...formData, email: 'admin@hrm.com', password: 'password123' })}
              >
                Admin
              </button>
              <button 
                type="button" 
                className="btn-secondary btn-sm" 
                onClick={() => setFormData({ ...formData, email: 'manager@hrm.com', password: 'password123' })}
              >
                Manager
              </button>
              <button 
                type="button" 
                className="btn-secondary btn-sm" 
                onClick={() => setFormData({ ...formData, email: 'teacher1@hrm.com', password: 'password123' })}
              >
                Teacher 1
              </button>
              <button 
                type="button" 
                className="btn-secondary btn-sm" 
                onClick={() => setFormData({ ...formData, email: 'student1@hrm.com', password: 'password123' })}
              >
                Student 1
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
