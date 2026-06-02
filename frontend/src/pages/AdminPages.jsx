import React, { useState, useEffect } from 'react';
import { Link, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { 
  Users, Calendar, GraduationCap, CheckSquare, DollarSign, 
  Plus, Trash2, Edit, Save, LogOut, CheckCircle, RefreshCw, X, ShieldAlert
} from 'lucide-react';

export function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem('user')) || { username: 'Admin', role: 'admin' };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const menuItems = [
    { label: 'Overview', path: '/admin', icon: <GraduationCap size={18} /> },
    { label: 'Classes & Catalog', path: '/admin/academic', icon: <Plus size={18} /> },
    { label: 'Weekly Timetable', path: '/admin/timetable', icon: <Calendar size={18} /> },
    { label: 'Task Checklist', path: '/admin/tasks', icon: <CheckSquare size={18} /> },
    { label: 'Finance & Payments', path: '/admin/payments', icon: <DollarSign size={18} /> },
    { label: 'Directories', path: '/admin/directories', icon: <Users size={18} /> }
  ];

  const getActiveTabClass = (path) => {
    if (path === '/admin') {
      return location.pathname === '/admin' ? 'active' : '';
    }
    return location.pathname.startsWith(path) ? 'active' : '';
  };

  return (
    <div className="dashboard-layout">
      <aside className="sidebar">
        <h2>
          <ShieldAlert size={28} color="var(--primary)" />
          <span>TutoryMS Admin</span>
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
          <Route index element={<AdminDashboard />} />
          <Route path="academic" element={<AdminAcademic />} />
          <Route path="timetable" element={<AdminTimetable />} />
          <Route path="tasks" element={<AdminTasks />} />
          <Route path="payments" element={<AdminPayments />} />
          <Route path="directories" element={<AdminDirectories />} />
        </Routes>
      </main>
    </div>
  );
}

// 1. DASHBOARD OVERVIEW
export function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('token');

  useEffect(() => {
    axios.get('http://localhost:5500/api/admin/stats', {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(res => {
      setStats(res.data);
      setLoading(false);
    })
    .catch(err => {
      console.error(err);
      setLoading(false);
    });
  }, []);

  if (loading) return <p>Loading analytical metrics...</p>;
  if (!stats) return <p>Could not connect to the statistics database.</p>;

  return (
    <div className="page">
      <h1 className="page-title">Overview Workspace</h1>
      <p className="page-subtitle">Visual indicators of student count, timetables, and billing statuses.</p>
      
      <div className="stats-grid">
        <div className="glass-card stat-card">
          <div className="stat-info">
            <h3>Registered Students</h3>
            <p className="stat-value">{stats.total_students}</p>
          </div>
          <div className="stat-icon"><Users size={24} /></div>
        </div>
        <div className="glass-card stat-card">
          <div className="stat-info">
            <h3>Tutors & Staff</h3>
            <p className="stat-value">{stats.total_teachers}</p>
          </div>
          <div className="stat-icon" style={{ color: 'var(--primary)' }}><Users size={24} /></div>
        </div>
        <div className="glass-card stat-card">
          <div className="stat-info">
            <h3>Classrooms</h3>
            <p className="stat-value">{stats.total_classes}</p>
          </div>
          <div className="stat-icon" style={{ color: 'var(--secondary)' }}><Calendar size={24} /></div>
        </div>
        <div className="glass-card stat-card">
          <div className="stat-info">
            <h3>Revenue Collected</h3>
            <p className="stat-value">Rs. {stats.fees.collected}</p>
          </div>
          <div className="stat-icon" style={{ color: 'var(--success)' }}><DollarSign size={24} /></div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '2rem', marginTop: '2rem' }}>
        <div className="glass-card">
          <h3>Task List Completion</h3>
          <div style={{ display: 'flex', gap: '2rem', marginTop: '1.5rem', alignItems: 'center' }}>
            <div style={{ position: 'relative', width: '120px', height: '120px', borderRadius: '50%', background: 'conic-gradient(var(--primary) 70%, rgba(255,255,255,0.05) 0)', display: 'flex', justifyContent: 'center', alignSelf: 'center', alignItems: 'center' }}>
              <div style={{ width: '100px', height: '100px', borderRadius: '50%', background: 'var(--bg-app)', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                <span style={{ fontSize: '1.5rem', fontWeight: '800' }}>70%</span>
                <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>Target Met</span>
              </div>
            </div>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <p>Total Delegated Tasks: <strong>{stats.tasks.total}</strong></p>
              <p>Pending Review: <strong style={{ color: 'var(--warning)' }}>{stats.tasks.pending}</strong></p>
              <p>Completed Checklist: <strong style={{ color: 'var(--success)' }}>{stats.tasks.completed}</strong></p>
            </div>
          </div>
        </div>

        <div className="glass-card">
          <h3>Collection Balance Sheet</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1.5rem' }}>
            <div>
              <p style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', marginBottom: '0.25rem' }}>
                <span>Collected Fees</span>
                <span>Rs. {stats.fees.collected}</span>
              </p>
              <div style={{ height: '8px', background: 'rgba(255,255,255,0.05)', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ height: '100%', background: 'var(--success)', width: `${stats.fees.collected + stats.fees.pending > 0 ? (stats.fees.collected / (stats.fees.collected + stats.fees.pending)) * 100 : 0}%` }}></div>
              </div>
            </div>
            <div>
              <p style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', marginBottom: '0.25rem' }}>
                <span>Outstanding Dues</span>
                <span style={{ color: 'var(--warning)' }}>Rs. {stats.fees.pending}</span>
              </p>
              <div style={{ height: '8px', background: 'rgba(255,255,255,0.05)', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ height: '100%', background: 'var(--warning)', width: `${stats.fees.collected + stats.fees.pending > 0 ? (stats.fees.pending / (stats.fees.collected + stats.fees.pending)) * 100 : 0}%` }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// 2. ACADEMIC & SUBJECT CATALOG MANAGEMENTS
export function AdminAcademic() {
  const [classes, setClasses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [classForm, setClassForm] = useState({ name: '', classroom: '' });
  const [subjectForm, setSubjectForm] = useState({ name: '', code: '' });
  const token = localStorage.getItem('token');

  const fetchAcademic = () => {
    axios.get('http://localhost:5500/api/admin/classes', { headers: { Authorization: `Bearer ${token}` } })
      .then(res => setClasses(res.data));
    axios.get('http://localhost:5500/api/admin/subjects', { headers: { Authorization: `Bearer ${token}` } })
      .then(res => setSubjects(res.data));
  };

  useEffect(() => {
    fetchAcademic();
  }, []);

  const handleAddClass = (e) => {
    e.preventDefault();
    axios.post('http://localhost:5500/api/admin/classes', classForm, { headers: { Authorization: `Bearer ${token}` } })
      .then(() => {
        setClassForm({ name: '', classroom: '' });
        fetchAcademic();
      });
  };

  const handleAddSubject = (e) => {
    e.preventDefault();
    axios.post('http://localhost:5500/api/admin/subjects', subjectForm, { headers: { Authorization: `Bearer ${token}` } })
      .then(() => {
        setSubjectForm({ name: '', code: '' });
        fetchAcademic();
      });
  };

  const handleDeleteClass = (id) => {
    if (confirm('Delete classroom? This cascade-deletes related schedules.')) {
      axios.delete(`http://localhost:5500/api/admin/classes/${id}`, { headers: { Authorization: `Bearer ${token}` } })
        .then(() => fetchAcademic());
    }
  };

  const handleDeleteSubject = (id) => {
    if (confirm('Delete subject?')) {
      axios.delete(`http://localhost:5500/api/admin/subjects/${id}`, { headers: { Authorization: `Bearer ${token}` } })
        .then(() => fetchAcademic());
    }
  };

  return (
    <div className="page">
      <h1 className="page-title">Classes & Program Catalog</h1>
      <p className="page-subtitle">Configure classrooms and compile subject indexes for TutoryMS.</p>

      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '3rem' }}>
        <div>
          <div className="glass-card" style={{ marginBottom: '2rem' }}>
            <h3>Create New Classroom</h3>
            <form onSubmit={handleAddClass} style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
              <input type="text" placeholder="Grade name (e.g. Grade 10)" value={classForm.name} onChange={(e) => setClassForm({ ...classForm, name: e.target.value })} required style={{ flex: 1, padding: '0.6rem' }} />
              <input type="text" placeholder="Classroom allocation" value={classForm.classroom} onChange={(e) => setClassForm({ ...classForm, classroom: e.target.value })} required style={{ flex: 1, padding: '0.6rem' }} />
              <button type="submit" className="btn-primary btn-sm"><Plus size={16} /> Add</button>
            </form>
          </div>

          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Class Title</th>
                  <th>Classroom Room</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {classes.map(c => (
                  <tr key={c.id}>
                    <td><strong>{c.name}</strong></td>
                    <td>{c.classroom}</td>
                    <td style={{ textAlign: 'right' }}>
                      <button onClick={() => handleDeleteClass(c.id)} className="btn-secondary btn-sm" style={{ border: 'none', color: 'var(--danger)' }}><Trash2 size={16} /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div>
          <div className="glass-card" style={{ marginBottom: '2rem' }}>
            <h3>Compile Course Subject</h3>
            <form onSubmit={handleAddSubject} style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
              <input type="text" placeholder="Subject Title" value={subjectForm.name} onChange={(e) => setSubjectForm({ ...subjectForm, name: e.target.value })} required style={{ flex: 1.5, padding: '0.6rem' }} />
              <input type="text" placeholder="Code (e.g. MAT101)" value={subjectForm.code} onChange={(e) => setSubjectForm({ ...subjectForm, code: e.target.value })} required style={{ flex: 0.8, padding: '0.6rem' }} />
              <button type="submit" className="btn-primary btn-sm"><Plus size={16} /> Add</button>
            </form>
          </div>

          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Code</th>
                  <th>Subject Title</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {subjects.map(s => (
                  <tr key={s.id}>
                    <td><span className="badge info">{s.code}</span></td>
                    <td>{s.name}</td>
                    <td style={{ textAlign: 'right' }}>
                      <button onClick={() => handleDeleteSubject(s.id)} className="btn-secondary btn-sm" style={{ border: 'none', color: 'var(--danger)' }}><Trash2 size={16} /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

// 3. WEEKLY TIMETABLE GRID MANAGER
export function AdminTimetable() {
  const [timetable, setTimetable] = useState([]);
  const [classes, setClasses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    class_id: '',
    subject_id: '',
    teacher_id: '',
    day_of_week: 'Monday',
    start_time: '08:30',
    end_time: '09:30',
    classroom: ''
  });
  const token = localStorage.getItem('token');

  const fetchData = () => {
    axios.get('http://localhost:5500/api/admin/timetable', { headers: { Authorization: `Bearer ${token}` } })
      .then(res => setTimetable(res.data));
    axios.get('http://localhost:5500/api/admin/classes', { headers: { Authorization: `Bearer ${token}` } })
      .then(res => setClasses(res.data));
    axios.get('http://localhost:5500/api/admin/subjects', { headers: { Authorization: `Bearer ${token}` } })
      .then(res => setSubjects(res.data));
    axios.get('http://localhost:5500/api/admin/teachers', { headers: { Authorization: `Bearer ${token}` } })
      .then(res => setTeachers(res.data));
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmitSlot = (e) => {
    e.preventDefault();
    axios.post('http://localhost:5500/api/admin/timetable', form, { headers: { Authorization: `Bearer ${token}` } })
      .then(() => {
        setShowModal(false);
        fetchData();
      })
      .catch(err => alert(err.response?.data?.message || 'Error scheduling timetable entry'));
  };

  const handleDeleteSlot = (id) => {
    if (confirm('Delete timetable slot?')) {
      axios.delete(`http://localhost:5500/api/admin/timetable/${id}`, { headers: { Authorization: `Bearer ${token}` } })
        .then(() => fetchData());
    }
  };

  return (
    <div className="page">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 className="page-title">Timetable Grid</h1>
          <p className="page-subtitle">Schedule subject classes and allocate teacher resources.</p>
        </div>
        <button onClick={() => setShowModal(true)} className="btn-primary">
          <Plus size={18} /> Schedule Class
        </button>
      </div>

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Class</th>
              <th>Day</th>
              <th>Time Slot</th>
              <th>Subject</th>
              <th>Teacher</th>
              <th>Room</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {timetable.map(slot => (
              <tr key={slot.id}>
                <td><strong>{slot.class_name}</strong></td>
                <td>{slot.day_of_week}</td>
                <td>{slot.start_time} - {slot.end_time}</td>
                <td>{slot.subject_name} ({slot.subject_code})</td>
                <td>{slot.teacher_first} {slot.teacher_last}</td>
                <td><span className="badge info">{slot.classroom}</span></td>
                <td style={{ textAlign: 'right' }}>
                  <button onClick={() => handleDeleteSlot(slot.id)} className="btn-secondary btn-sm text-danger" style={{ border: 'none' }}><Trash2 size={16} /></button>
                </td>
              </tr>
            ))}
            {timetable.length === 0 && (
              <tr><td colSpan="7" style={{ textAlign: 'center', padding: '3rem' }}>No slots scheduled yet.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="modal-backdrop">
          <div className="glass-card modal-content">
            <div className="modal-header">
              <h3 className="modal-title">Schedule New Time Slot</h3>
              <button onClick={() => setShowModal(false)} className="modal-close"><X size={20} /></button>
            </div>
            <form onSubmit={handleSubmitSlot} className="contact-form">
              <div className="form-group">
                <label>Select Target Class</label>
                <select value={form.class_id} onChange={(e) => setForm({ ...form, class_id: e.target.value })} required>
                  <option value="">-- Choose Class --</option>
                  {classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label>Select Subject</label>
                <select value={form.subject_id} onChange={(e) => setForm({ ...form, subject_id: e.target.value })} required>
                  <option value="">-- Choose Subject --</option>
                  {subjects.map(s => <option key={s.id} value={s.id}>{s.name} ({s.code})</option>)}
                </select>
              </div>
              <div className="form-group">
                <label>Assign Teacher / Tutor</label>
                <select value={form.teacher_id} onChange={(e) => setForm({ ...form, teacher_id: e.target.value })} required>
                  <option value="">-- Choose Teacher --</option>
                  {teachers.map(t => <option key={t.id} value={t.id}>{t.first_name} {t.last_name}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label>Day of the Week</label>
                <select value={form.day_of_week} onChange={(e) => setForm({ ...form, day_of_week: e.target.value })} required>
                  {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(d => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label>Start Time</label>
                  <input type="text" placeholder="08:30" value={form.start_time} onChange={(e) => setForm({ ...form, start_time: e.target.value })} required />
                </div>
                <div className="form-group">
                  <label>End Time</label>
                  <input type="text" placeholder="09:30" value={form.end_time} onChange={(e) => setForm({ ...form, end_time: e.target.value })} required />
                </div>
              </div>
              <div className="form-group">
                <label>Classroom Room Number</label>
                <input type="text" placeholder="Room 101" value={form.classroom} onChange={(e) => setForm({ ...form, classroom: e.target.value })} required />
              </div>
              <button type="submit" className="btn-primary" style={{ justifyContent: 'center', marginTop: '1rem' }}><CheckCircle size={18} /> Confirm Slot</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// 4. TASKS DELEGATOR
export function AdminTasks() {
  const [tasks, setTasks] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [staff, setStaff] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    title: '',
    description: '',
    assigned_to_type: 'teacher',
    assigned_to_id: '',
    priority: 'Medium',
    deadline: ''
  });
  const token = localStorage.getItem('token');

  const fetchData = () => {
    axios.get('http://localhost:5500/api/admin/tasks', { headers: { Authorization: `Bearer ${token}` } })
      .then(res => setTasks(res.data));
    axios.get('http://localhost:5500/api/admin/teachers', { headers: { Authorization: `Bearer ${token}` } })
      .then(res => setTeachers(res.data));
    axios.get('http://localhost:5500/api/admin/staff', { headers: { Authorization: `Bearer ${token}` } })
      .then(res => setStaff(res.data));
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmitTask = (e) => {
    e.preventDefault();
    axios.post('http://localhost:5500/api/admin/tasks', form, { headers: { Authorization: `Bearer ${token}` } })
      .then(() => {
        setShowModal(false);
        setForm({ title: '', description: '', assigned_to_type: 'teacher', assigned_to_id: '', priority: 'Medium', deadline: '' });
        fetchData();
      });
  };

  const handleDeleteTask = (id) => {
    if (confirm('Delete task?')) {
      axios.delete(`http://localhost:5500/api/admin/tasks/${id}`, { headers: { Authorization: `Bearer ${token}` } })
        .then(() => fetchData());
    }
  };

  const getPriorityBadge = (p) => {
    if (p === 'High') return 'badge danger';
    if (p === 'Medium') return 'badge warning';
    return 'badge info';
  };

  const getStatusBadge = (s) => {
    if (s === 'Completed') return 'badge success';
    if (s === 'In Progress') return 'badge info';
    return 'badge warning';
  };

  return (
    <div className="page">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 className="page-title">Tasks Checklist</h1>
          <p className="page-subtitle">Delegate school assignments to academic teachers or operational managers.</p>
        </div>
        <button onClick={() => setShowModal(true)} className="btn-primary"><Plus size={18} /> Delegate Task</button>
      </div>

      <div className="task-list">
        {tasks.map(task => (
          <div className="glass-card task-item" key={task.id}>
            <div className="task-details">
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '0.25rem' }}>
                <span className={getPriorityBadge(task.priority)}>{task.priority} Priority</span>
                <span className={getStatusBadge(task.status)}>{task.status}</span>
              </div>
              <h3 className="task-title">{task.title}</h3>
              <p className="task-desc">{task.description}</p>
              <div className="task-meta">
                <span>Assigned Role: <strong>{task.assigned_to_type.toUpperCase()} #{task.assigned_to_id}</strong></span>
                <span>Deadline: <strong>{new Date(task.deadline).toLocaleDateString()}</strong></span>
              </div>
            </div>
            <div className="task-actions">
              <button onClick={() => handleDeleteTask(task.id)} className="btn-secondary btn-sm" style={{ borderColor: 'transparent', color: 'var(--danger)' }}><Trash2 size={18} /></button>
            </div>
          </div>
        ))}
        {tasks.length === 0 && <p style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: '3rem' }}>All tasks cleared.</p>}
      </div>

      {showModal && (
        <div className="modal-backdrop">
          <div className="glass-card modal-content">
            <div className="modal-header">
              <h3 className="modal-title">Delegate New Task</h3>
              <button onClick={() => setShowModal(false)} className="modal-close"><X size={20} /></button>
            </div>
            <form onSubmit={handleSubmitTask} className="contact-form">
              <div className="form-group">
                <label>Task Title</label>
                <input type="text" placeholder="Prepare math paper..." value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
              </div>
              <div className="form-group">
                <label>Detailed Description</label>
                <textarea placeholder="Audit and review materials..." rows="3" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} required></textarea>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label>Assign To Type</label>
                  <select value={form.assigned_to_type} onChange={(e) => setForm({ ...form, assigned_to_type: e.target.value, assigned_to_id: '' })}>
                    <option value="teacher">Teacher</option>
                    <option value="staff">Staff/Manager</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Assignee Profile</label>
                  <select value={form.assigned_to_id} onChange={(e) => setForm({ ...form, assigned_to_id: e.target.value })} required>
                    <option value="">-- Select Member --</option>
                    {form.assigned_to_type === 'teacher' 
                      ? teachers.map(t => <option key={t.id} value={t.id}>{t.first_name} {t.last_name}</option>)
                      : staff.map(st => <option key={st.id} value={st.id}>{st.first_name} {st.last_name}</option>)
                    }
                  </select>
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label>Priority</label>
                  <select value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value })}>
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Due Date</label>
                  <input type="date" value={form.deadline} onChange={(e) => setForm({ ...form, deadline: e.target.value })} required />
                </div>
              </div>
              <button type="submit" className="btn-primary" style={{ justifyContent: 'center', marginTop: '1rem' }}><CheckCircle size={18} /> Confirm Task</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// 5. FINANCE & INVOICING OVERSEE
export function AdminPayments() {
  const [payments, setPayments] = useState([]);
  const [students, setStudents] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ student_id: '', amount: '', description: 'Academic Fee - Term 1' });
  const token = localStorage.getItem('token');

  const fetchData = () => {
    axios.get('http://localhost:5500/api/admin/payments', { headers: { Authorization: `Bearer ${token}` } })
      .then(res => setPayments(res.data));
    axios.get('http://localhost:5500/api/admin/students', { headers: { Authorization: `Bearer ${token}` } })
      .then(res => setStudents(res.data));
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreateInvoice = (e) => {
    e.preventDefault();
    axios.post('http://localhost:5500/api/admin/payments', form, { headers: { Authorization: `Bearer ${token}` } })
      .then(() => {
        setShowModal(false);
        setForm({ student_id: '', amount: '', description: 'Academic Fee - Term 1' });
        fetchData();
      });
  };

  const handleDeleteInvoice = (id) => {
    if (confirm('Delete invoice record?')) {
      axios.delete(`http://localhost:5500/api/admin/payments/${id}`, { headers: { Authorization: `Bearer ${token}` } })
        .then(() => fetchData());
    }
  };

  return (
    <div className="page">
      <div style={{ display: 'flex', justifycontent: 'space-between', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 className="page-title">Finance Ledger</h1>
          <p className="page-subtitle">Review school transactions, invoice students, and verify billing dues.</p>
        </div>
        <button onClick={() => setShowModal(true)} className="btn-primary"><Plus size={18} /> Create Invoice</button>
      </div>

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Invoice #</th>
              <th>Student</th>
              <th>Allocated Class</th>
              <th>Amount</th>
              <th>Billing Item</th>
              <th>Payment Status</th>
              <th>Paid On</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {payments.map(inv => (
              <tr key={inv.id}>
                <td><strong>#INV-{inv.id}</strong></td>
                <td>{inv.first_name} {inv.last_name}</td>
                <td>{inv.class_allocated}</td>
                <td>Rs. {inv.amount}</td>
                <td>{inv.description}</td>
                <td>
                  <span className={`badge ${inv.status === 'Completed' ? 'success' : 'warning'}`}>{inv.status}</span>
                </td>
                <td>{inv.payment_date ? new Date(inv.payment_date).toLocaleDateString() : '--'}</td>
                <td style={{ textAlign: 'right' }}>
                  <button onClick={() => handleDeleteInvoice(inv.id)} className="btn-secondary btn-sm" style={{ border: 'none', color: 'var(--danger)' }}><Trash2 size={16} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="modal-backdrop">
          <div className="glass-card modal-content">
            <div className="modal-header">
              <h3 className="modal-title">Issue Fee Invoice</h3>
              <button onClick={() => setShowModal(false)} className="modal-close"><X size={20} /></button>
            </div>
            <form onSubmit={handleCreateInvoice} className="contact-form">
              <div className="form-group">
                <label>Select Recipient Student</label>
                <select value={form.student_id} onChange={(e) => setForm({ ...form, student_id: e.target.value })} required>
                  <option value="">-- Choose Student --</option>
                  {students.map(st => <option key={st.id} value={st.id}>{st.first_name} {st.last_name} ({st.class_allocated})</option>)}
                </select>
              </div>
              <div className="form-group">
                <label>Invoiced Amount (Rs.)</label>
                <input type="number" placeholder="15000" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} required />
              </div>
              <div className="form-group">
                <label>Description</label>
                <input type="text" placeholder="Term Fee - Term 1" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} required />
              </div>
              <button type="submit" className="btn-primary" style={{ justifyContent: 'center', marginTop: '1rem' }}><CheckCircle size={18} /> Issue Invoicing</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// 6. USERS DIRECTORIES
export function AdminDirectories() {
  const [students, setStudents] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [staff, setStaff] = useState([]);
  const [activeTab, setActiveTab] = useState('student');
  const token = localStorage.getItem('token');

  useEffect(() => {
    axios.get('http://localhost:5500/api/admin/students', { headers: { Authorization: `Bearer ${token}` } })
      .then(res => setStudents(res.data));
    axios.get('http://localhost:5500/api/admin/teachers', { headers: { Authorization: `Bearer ${token}` } })
      .then(res => setTeachers(res.data));
    axios.get('http://localhost:5500/api/admin/staff', { headers: { Authorization: `Bearer ${token}` } })
      .then(res => setStaff(res.data));
  }, []);

  return (
    <div className="page">
      <h1 className="page-title">System Directory</h1>
      <p className="page-subtitle">Index registry of all academic students, teaching staff, and directors.</p>

      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
        {['student', 'teacher', 'staff'].map(t => (
          <button 
            key={t}
            className={`btn-secondary ${activeTab === t ? 'btn-primary' : ''}`}
            onClick={() => setActiveTab(t)}
            style={{ textTransform: 'capitalize' }}
          >
            {t}s ({t === 'student' ? students.length : t === 'teacher' ? teachers.length : staff.length})
          </button>
        ))}
      </div>

      <div className="table-container">
        {activeTab === 'student' && (
          <table className="data-table">
            <thead>
              <tr>
                <th>Username</th>
                <th>Full Name</th>
                <th>Allocated Class</th>
                <th>Parent Contact</th>
                <th>Contact Phone</th>
              </tr>
            </thead>
            <tbody>
              {students.map(st => (
                <tr key={st.id}>
                  <td><strong>{st.username}</strong></td>
                  <td>{st.first_name} {st.last_name}</td>
                  <td><span className="badge success">{st.class_allocated}</span></td>
                  <td>{st.parent_name} ({st.parent_phone})</td>
                  <td>{st.phone}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {activeTab === 'teacher' && (
          <table className="data-table">
            <thead>
              <tr>
                <th>Username</th>
                <th>Teacher Name</th>
                <th>Phone</th>
                <th>Subjects Handled</th>
                <th>Classes Coordinated</th>
              </tr>
            </thead>
            <tbody>
              {teachers.map(t => (
                <tr key={t.id}>
                  <td><strong>{t.username}</strong></td>
                  <td>{t.first_name} {t.last_name}</td>
                  <td>{t.phone}</td>
                  <td><span className="badge info">{t.subjects}</span></td>
                  <td>{t.classes}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {activeTab === 'staff' && (
          <table className="data-table">
            <thead>
              <tr>
                <th>Username</th>
                <th>Staff Name</th>
                <th>Phone</th>
                <th>Designation</th>
                <th>Department</th>
              </tr>
            </thead>
            <tbody>
              {staff.map(st => (
                <tr key={st.id}>
                  <td><strong>{st.username}</strong></td>
                  <td>{st.first_name} {st.last_name}</td>
                  <td>{st.phone}</td>
                  <td><span className="badge info">{st.designation}</span></td>
                  <td>{st.department}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
