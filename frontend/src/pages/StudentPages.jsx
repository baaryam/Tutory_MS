import React, { useState, useEffect } from 'react';
import { Link, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { 
  Calendar, Award, DollarSign, BookOpen, Clock, 
  CreditCard, ShieldCheck, LogOut, CheckCircle, X, MapPin, User 
} from 'lucide-react';

export function StudentLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem('user')) || { username: 'Student', role: 'student' };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const menuItems = [
    { label: 'My Portal', path: '/student', icon: <User size={18} /> },
    { label: 'Weekly Schedule', path: '/student/timetable', icon: <Calendar size={18} /> },
    { label: 'Report Card', path: '/student/grades', icon: <Award size={18} /> },
    { label: 'Billing & Fees', path: '/student/billing', icon: <DollarSign size={18} /> }
  ];

  const getActiveTabClass = (path) => {
    if (path === '/student') {
      return location.pathname === '/student' ? 'active' : '';
    }
    return location.pathname.startsWith(path) ? 'active' : '';
  };

  return (
    <div className="dashboard-layout">
      <aside className="sidebar">
        <h2>
          <GraduationCap size={28} color="var(--primary)" />
          <span>TutoryMS Portal</span>
        </h2>
        <nav className="sidebar-nav">
          {menuItems.map((item, idx) => (
            <Link key={idx} to={item.path} className={getActiveTabClass(item.path)}>
              {item.icon}
              {item.label}
            </Link>
          ))}
          <button onClick={handleLogout} className="btn-secondary" style={{ marginTop: 'auto', border: '1px solid var(--danger)', color: 'var(--danger)', justifyContent: 'center' }}>
            <LogOut size={16} /> Logout
          </button>
        </nav>
        <div className="sidebar-user">
          <div className="user-avatar">{user.username[0].toUpperCase()}</div>
          <div className="user-info">
            <h4>{user.username}</h4>
            <p>{user.role}</p>
          </div>
        </div>
      </aside>
      <main className="dashboard-content">
        <Routes>
          <Route index element={<StudentOverview />} />
          <Route path="timetable" element={<StudentSchedule />} />
          <Route path="grades" element={<StudentGrades />} />
          <Route path="billing" element={<StudentBilling />} />
        </Routes>
      </main>
    </div>
  );
}

// Graduation cap icon helper since it's imported globally
function GraduationCap(props) {
  return <Award {...props} />;
}

// 1. OVERVIEW & PROFILE INFO
export function StudentOverview() {
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('token');

  useEffect(() => {
    axios.get('http://localhost:5500/api/student/schedule', {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(res => {
      setStudent(res.data.student);
      setLoading(false);
    })
    .catch(err => {
      console.error(err);
      setLoading(false);
    });
  }, []);

  if (loading) return <p>Loading student overview...</p>;
  if (!student) return <p>Student profile details not available.</p>;

  return (
    <div className="page">
      <h1 className="page-title">Welcome back, {student.first_name}!</h1>
      <p className="page-subtitle">Access your report card, view coordinated classes, and manage your billing due dates.</p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '2.5rem' }}>
        <div className="glass-card" style={{ height: 'fit-content' }}>
          <h3>Profile Overview</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1.5rem' }}>
            <p>Class Allocation: <span className="badge success">{student.class_allocated || 'Unallocated'}</span></p>
            <p>Email: <strong style={{ color: 'var(--text-secondary)' }}>{student.email}</strong></p>
            <p>Phone: <strong style={{ color: 'var(--text-secondary)' }}>{student.phone}</strong></p>
            <hr style={{ borderColor: 'var(--glass-border)' }} />
            <h4 style={{ fontSize: '1rem', color: 'var(--secondary)' }}>Parent / Guardian</h4>
            <p>Name: <strong style={{ color: 'var(--text-secondary)' }}>{student.parent_name}</strong></p>
            <p>Guardian Phone: <strong style={{ color: 'var(--text-secondary)' }}>{student.parent_phone}</strong></p>
            <p>Guardian Email: <strong style={{ color: 'var(--text-secondary)' }}>{student.parent_email}</strong></p>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div className="glass-card">
            <h3>Quick Status Checks</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginTop: '1.5rem' }}>
              <div className="stat-card" style={{ background: 'rgba(255,255,255,0.01)', border: '1px solid var(--glass-border)', padding: '1rem', borderRadius: '12px' }}>
                <div>
                  <h4 style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Exam Attendance</h4>
                  <p style={{ fontSize: '1.75rem', fontWeight: '800', color: 'var(--secondary)' }}>100%</p>
                </div>
              </div>
              <div className="stat-card" style={{ background: 'rgba(255,255,255,0.01)', border: '1px solid var(--glass-border)', padding: '1rem', borderRadius: '12px' }}>
                <div>
                  <h4 style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Billing Status</h4>
                  <p style={{ fontSize: '1.75rem', fontWeight: '800', color: 'var(--success)' }}>Active</p>
                </div>
              </div>
            </div>
          </div>

          <div className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            <div className="stat-icon" style={{ padding: '1rem', background: 'rgba(0,212,255,0.1)', color: 'var(--secondary)', borderRadius: '14px' }}>
              <ShieldCheck size={32} />
            </div>
            <div>
              <h3>Secure Simulated Transactions</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '0.25rem' }}>
                TutoryMS provides sandbox checkouts using virtual debit cards to safely simulate paying fee invoices online.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// 2. TIMETABLE
export function StudentSchedule() {
  const [schedule, setSchedule] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('token');

  useEffect(() => {
    axios.get('http://localhost:5500/api/student/schedule', {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(res => {
      setSchedule(res.data.schedule);
      setLoading(false);
    })
    .catch(err => {
      console.error(err);
      setLoading(false);
    });
  }, []);

  if (loading) return <p>Loading schedule slots...</p>;

  return (
    <div className="page">
      <h1 className="page-title">Weekly Schedule</h1>
      <p className="page-subtitle">Detailed subject timing and classroom rooms allocated to your class.</p>

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Day of Week</th>
              <th>Time Slot</th>
              <th>Subject</th>
              <th>Coordinating Tutor</th>
              <th>Classroom</th>
            </tr>
          </thead>
          <tbody>
            {schedule.map(slot => (
              <tr key={slot.id}>
                <td><strong>{slot.day_of_week}</strong></td>
                <td>{slot.start_time} - {slot.end_time}</td>
                <td>{slot.subject_name} ({slot.subject_code})</td>
                <td>Prof. {slot.teacher_first} {slot.teacher_last}</td>
                <td><span className="badge info">{slot.classroom}</span></td>
              </tr>
            ))}
            {schedule.length === 0 && (
              <tr><td colSpan="5" style={{ textAlign: 'center', padding: '3rem' }}>No slots scheduled yet for your class.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// 3. REPORT CARD / GRADES
export function StudentGrades() {
  const [grades, setGrades] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('token');

  useEffect(() => {
    axios.get('http://localhost:5500/api/student/grades', {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(res => {
      setGrades(res.data);
      setLoading(false);
    })
    .catch(err => {
      console.error(err);
      setLoading(false);
    });
  }, []);

  if (loading) return <p>Loading report card...</p>;

  return (
    <div className="page">
      <h1 className="page-title">Report Card</h1>
      <p className="page-subtitle">Publishing of midterm and term end marks reviewed by teaching tutors.</p>

      <div className="report-card-grid">
        {grades.map(grade => (
          <div className="glass-card report-subject-card" key={grade.id}>
            <span className="subject-code">{grade.subject_code}</span>
            <h3>{grade.subject_name}</h3>
            <p className="report-grade">{grade.grade}</p>
            <p className="report-marks">Score: {grade.marks}%</p>
            <p className="report-exam-name">{grade.exam_name}</p>
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', justifyContent: 'center', marginTop: '1rem', color: 'var(--text-muted)', fontSize: '0.75rem' }}>
              <Clock size={12} /> {new Date(grade.exam_date).toLocaleDateString()}
            </div>
          </div>
        ))}
        {grades.length === 0 && (
          <p style={{ gridColumn: '1/-1', textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)' }}>No exam grades published yet.</p>
        )}
      </div>
    </div>
  );
}

// 4. BILLING & FEE CHECKOUT
export function StudentBilling() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCheckout, setShowCheckout] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  
  // Simulated Card Info
  const [cardHolder, setCardHolder] = useState('');
  const [cardNumber, setCardNumber] = useState('•••• •••• •••• ••••');
  const [cardExpiry, setCardExpiry] = useState('MM/YY');
  const [processing, setProcessing] = useState(false);
  const [completed, setCompleted] = useState(false);
  
  const token = localStorage.getItem('token');

  const fetchPayments = () => {
    axios.get('http://localhost:5500/api/student/payments', {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(res => {
      setPayments(res.data);
      setLoading(false);
    })
    .catch(err => {
      console.error(err);
      setLoading(false);
    });
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  const handleCheckoutInit = (inv) => {
    setSelectedInvoice(inv);
    setShowCheckout(true);
    setCompleted(false);
    setCardHolder('');
    setCardNumber('•••• •••• •••• ••••');
    setCardExpiry('MM/YY');
  };

  const handleSimulatePayment = (e) => {
    e.preventDefault();
    setProcessing(true);

    axios.post(`http://localhost:5500/api/student/payments/${selectedInvoice.id}/pay`, {
      payment_method: 'Online Card',
      transaction_id: `TXN${Date.now()}`
    }, {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(() => {
      setProcessing(false);
      setCompleted(true);
      setTimeout(() => {
        setShowCheckout(false);
        fetchPayments();
      }, 2000);
    })
    .catch(err => {
      alert('Error updating payment status');
      setProcessing(false);
    });
  };

  if (loading) return <p>Loading billing invoices...</p>;

  return (
    <div className="page">
      <h1 className="page-title">Academic Tuition Billing</h1>
      <p className="page-subtitle">Track paid invoices and checkout outstanding school fees.</p>

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Invoice #</th>
              <th>Billing Item</th>
              <th>Amount</th>
              <th>Due Status</th>
              <th>Paid Timestamp</th>
              <th>Transaction ID</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {payments.map(inv => (
              <tr key={inv.id}>
                <td><strong>#INV-{inv.id}</strong></td>
                <td>{inv.description}</td>
                <td>Rs. {inv.amount}</td>
                <td>
                  <span className={`badge ${inv.status === 'Completed' ? 'success' : 'warning'}`}>{inv.status}</span>
                </td>
                <td>{inv.payment_date ? new Date(inv.payment_date).toLocaleString() : '--'}</td>
                <td>{inv.transaction_id || '--'}</td>
                <td style={{ textAlign: 'right' }}>
                  {inv.status === 'Pending' && (
                    <button 
                      onClick={() => handleCheckoutInit(inv)}
                      className="btn-primary btn-sm"
                    >
                      <CreditCard size={14} /> Pay Fee
                    </button>
                  )}
                  {inv.status === 'Completed' && (
                    <span style={{ color: 'var(--success)', display: 'inline-flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.85rem', fontWeight: 600 }}>
                      <CheckCircle size={14} /> Settled
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showCheckout && (
        <div className="modal-backdrop">
          <div className="glass-card modal-content" style={{ maxWidth: '480px' }}>
            <div className="modal-header">
              <h3 className="modal-title">Complete Checkout</h3>
              <button onClick={() => setShowCheckout(false)} className="modal-close"><X size={20} /></button>
            </div>
            
            {completed ? (
              <div style={{ textAlign: 'center', padding: '2rem 0' }}>
                <CheckCircle size={64} color="var(--success)" style={{ display: 'block', margin: '0 auto 1rem' }} />
                <h3>Payment Completed!</h3>
                <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem' }}>Your receipt invoice has been cleared successfully.</p>
              </div>
            ) : (
              <form onSubmit={handleSimulatePayment} className="contact-form">
                {/* Credit Card Graphic */}
                <div className="credit-card-container">
                  <div className="credit-card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div className="card-chip"></div>
                      <ShieldCheck size={28} color="rgba(255,255,255,0.7)" />
                    </div>
                    <div className="card-number">{cardNumber}</div>
                    <div className="card-footer">
                      <div className="card-holder">
                        <div style={{ fontSize: '0.55rem', opacity: 0.6, marginBottom: '0.1rem' }}>CARDHOLDER</div>
                        {cardHolder || 'FULL NAME'}
                      </div>
                      <div className="card-expiry">
                        <div style={{ fontSize: '0.55rem', opacity: 0.6, marginBottom: '0.1rem' }}>EXPIRES</div>
                        {cardExpiry}
                      </div>
                    </div>
                  </div>
                </div>

                <p style={{ textAlign: 'center', fontWeight: 'bold', fontSize: '1.1rem', marginBottom: '1rem' }}>
                  Billing Amount: Rs. {selectedInvoice.amount}
                </p>

                <div className="form-group">
                  <label>Cardholder Name</label>
                  <input 
                    type="text" 
                    placeholder="John Doe" 
                    required 
                    value={cardHolder}
                    onChange={(e) => setCardHolder(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label>Card Number</label>
                  <input 
                    type="text" 
                    placeholder="4321 8765 1234 5678" 
                    maxLength="19"
                    required
                    onChange={(e) => setCardNumber(e.target.value)}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className="form-group">
                    <label>Expiration</label>
                    <input 
                      type="text" 
                      placeholder="12/28" 
                      maxLength="5"
                      required
                      onChange={(e) => setCardExpiry(e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label>CVV</label>
                    <input type="password" placeholder="•••" maxLength="3" required />
                  </div>
                </div>

                <button 
                  type="submit" 
                  className="btn-primary" 
                  disabled={processing}
                  style={{ justifyContent: 'center', marginTop: '1.5rem' }}
                >
                  {processing ? 'Processing Securely...' : `Pay Rs. ${selectedInvoice.amount}`}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
