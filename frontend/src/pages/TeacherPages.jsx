import React, { useState, useEffect } from 'react';
import { Link, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { 
  Calendar, CheckSquare, Award, BookOpen, Plus, 
  CheckCircle, LogOut, CheckSquare as CheckIcon, Clock, X 
} from 'lucide-react';

export function TeacherLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem('user')) || { username: 'Teacher', role: 'teacher' };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const menuItems = [
    { label: 'My Schedule', path: '/teacher', icon: <Calendar size={18} /> },
    { label: 'My Tasks', path: '/teacher/tasks', icon: <CheckSquare size={18} /> },
    { label: 'Gradebook', path: '/teacher/grades', icon: <Award size={18} /> }
  ];

  const getActiveTabClass = (path) => {
    if (path === '/teacher') {
      return location.pathname === '/teacher' ? 'active' : '';
    }
    return location.pathname.startsWith(path) ? 'active' : '';
  };

  return (
    <div className="dashboard-layout">
      <aside className="sidebar">
        <h2>
          <BookOpen size={28} color="var(--primary)" />
          <span>TutoryMS Tutor</span>
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
          <Route index element={<TeacherSchedule />} />
          <Route path="tasks" element={<TeacherTasks />} />
          <Route path="grades" element={<TeacherGrades />} />
        </Routes>
      </main>
    </div>
  );
}

// 1. TEACHER SCHEDULE / PROFILE
export function TeacherSchedule() {
  const [profile, setProfile] = useState(null);
  const [schedule, setSchedule] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('token');

  useEffect(() => {
    axios.get('http://localhost:5500/api/teacher/schedule', {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(res => {
      setProfile(res.data.teacher);
      setSchedule(res.data.schedule);
      setLoading(false);
    })
    .catch(err => {
      console.error(err);
      setLoading(false);
    });
  }, []);

  if (loading) return <p>Loading schedule slots...</p>;
  if (!profile) return <p>Could not load teacher profile.</p>;

  return (
    <div className="page">
      <h1 className="page-title">Tutor Workspace</h1>
      <p className="page-subtitle">Welcome back, Prof. {profile.first_name} {profile.last_name}. Review your coordinated timetable classes.</p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '2.5rem' }}>
        <div className="glass-card" style={{ height: 'fit-content' }}>
          <h3>Profile Credentials</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1.5rem' }}>
            <p>Email: <strong style={{ color: 'var(--text-secondary)' }}>{profile.email}</strong></p>
            <p>Phone: <strong style={{ color: 'var(--text-secondary)' }}>{profile.phone}</strong></p>
            <p>Coordinated Subjects: <span className="badge info">{profile.subjects}</span></p>
            <p>Classrooms Allocated: <span className="badge success">{profile.classes}</span></p>
            <p>Weekly Availability: <strong style={{ color: 'var(--secondary)' }}>{profile.availability}</strong></p>
          </div>
        </div>

        <div>
          <h3>Timetable Slots</h3>
          <div className="table-container" style={{ marginTop: '1.5rem' }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Class</th>
                  <th>Day</th>
                  <th>Time Slot</th>
                  <th>Subject</th>
                  <th>Room</th>
                </tr>
              </thead>
              <tbody>
                {schedule.map(slot => (
                  <tr key={slot.id}>
                    <td><strong>{slot.class_name}</strong></td>
                    <td>{slot.day_of_week}</td>
                    <td>{slot.start_time} - {slot.end_time}</td>
                    <td>{slot.subject_name}</td>
                    <td><span className="badge info">{slot.classroom}</span></td>
                  </tr>
                ))}
                {schedule.length === 0 && (
                  <tr><td colSpan="5" style={{ textAlign: 'center', padding: '3rem' }}>No slots scheduled yet.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

// 2. TEACHER ASSIGNED TASKS
export function TeacherTasks() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('token');

  const fetchTasks = () => {
    axios.get('http://localhost:5500/api/teacher/tasks', {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(res => {
      setTasks(res.data);
      setLoading(false);
    })
    .catch(err => {
      console.error(err);
      setLoading(false);
    });
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleUpdateStatus = (id, currentStatus) => {
    const nextStatus = currentStatus === 'Pending' ? 'In Progress' : currentStatus === 'In Progress' ? 'Completed' : 'Pending';
    axios.put(`http://localhost:5500/api/teacher/tasks/${id}/status`, { status: nextStatus }, {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(() => fetchTasks());
  };

  if (loading) return <p>Loading checklist...</p>;

  return (
    <div className="page">
      <h1 className="page-title">Coordinated Assignments</h1>
      <p className="page-subtitle">Track and check off administrative tasks assigned to you by administrators.</p>

      <div className="task-list">
        {tasks.map(task => (
          <div className="glass-card task-item" key={task.id}>
            <div className="task-details">
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '0.25rem' }}>
                <span className={`badge ${task.priority === 'High' ? 'danger' : task.priority === 'Medium' ? 'warning' : 'info'}`}>
                  {task.priority} Priority
                </span>
                <span className={`badge ${task.status === 'Completed' ? 'success' : task.status === 'In Progress' ? 'info' : 'warning'}`}>
                  {task.status}
                </span>
              </div>
              <h3 className="task-title" style={{ textDecoration: task.status === 'Completed' ? 'line-through' : 'none', color: task.status === 'Completed' ? 'var(--text-muted)' : 'inherit' }}>
                {task.title}
              </h3>
              <p className="task-desc">{task.description}</p>
              <div className="task-meta">
                <span>Deadline: <strong>{new Date(task.deadline).toLocaleDateString()}</strong></span>
              </div>
            </div>
            <button 
              onClick={() => handleUpdateStatus(task.id, task.status)}
              className={`btn-primary btn-sm ${task.status === 'Completed' ? 'btn-danger' : ''}`}
            >
              {task.status === 'Completed' ? 'Reset Task' : task.status === 'In Progress' ? 'Complete Task' : 'Start Task'}
            </button>
          </div>
        ))}
        {tasks.length === 0 && (
          <p style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)' }}>You have no tasks assigned.</p>
        )}
      </div>
    </div>
  );
}

// 3. GRADEBOOK / STUDENT PUBLISHING
export function TeacherGrades() {
  const [grades, setGrades] = useState([]);
  const [students, setStudents] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    student_id: '',
    subject_id: '',
    marks: '',
    exam_name: 'Mid-Term Exam',
    grade: 'A',
    exam_date: new Date().toISOString().split('T')[0]
  });
  const token = localStorage.getItem('token');

  const fetchData = () => {
    axios.get('http://localhost:5500/api/teacher/exam-results', { headers: { Authorization: `Bearer ${token}` } })
      .then(res => setGrades(res.data));
    axios.get('http://localhost:5500/api/teacher/students', { headers: { Authorization: `Bearer ${token}` } })
      .then(res => setStudents(res.data));
    axios.get('http://localhost:5500/api/admin/subjects', { headers: { Authorization: `Bearer ${token}` } })
      .then(res => setSubjects(res.data));
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmitGrade = (e) => {
    e.preventDefault();
    axios.post('http://localhost:5500/api/teacher/exam-results', form, { headers: { Authorization: `Bearer ${token}` } })
      .then(() => {
        setShowModal(false);
        setForm({
          student_id: '',
          subject_id: '',
          marks: '',
          exam_name: 'Mid-Term Exam',
          grade: 'A',
          exam_date: new Date().toISOString().split('T')[0]
        });
        fetchData();
      });
  };

  return (
    <div className="page">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 className="page-title">Student Gradebook</h1>
          <p className="page-subtitle">Publish mid-term/term marks and award letter grades to allocated classes.</p>
        </div>
        <button onClick={() => setShowModal(true)} className="btn-primary"><Plus size={18} /> Award Grade</button>
      </div>

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Student Name</th>
              <th>Allocated Class</th>
              <th>Subject</th>
              <th>Marks Awarded</th>
              <th>Letter Grade</th>
              <th>Exam Name</th>
              <th>Exam Date</th>
            </tr>
          </thead>
          <tbody>
            {grades.map(g => (
              <tr key={g.id}>
                <td><strong>{g.student_first} {g.student_last}</strong></td>
                <td>{g.class_allocated}</td>
                <td>{g.subject_name}</td>
                <td><strong>{g.marks}%</strong></td>
                <td><span className={`badge ${g.grade === 'A' ? 'success' : g.grade === 'B' ? 'info' : 'warning'}`}>{g.grade}</span></td>
                <td>{g.exam_name}</td>
                <td>{new Date(g.exam_date).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="modal-backdrop">
          <div className="glass-card modal-content">
            <div className="modal-header">
              <h3 className="modal-title">Publish Term Grade</h3>
              <button onClick={() => setShowModal(false)} className="modal-close"><X size={20} /></button>
            </div>
            <form onSubmit={handleSubmitGrade} className="contact-form">
              <div className="form-group">
                <label>Select Target Student</label>
                <select value={form.student_id} onChange={(e) => setForm({ ...form, student_id: e.target.value })} required>
                  <option value="">-- Choose Student --</option>
                  {students.map(st => (
                    <option key={st.id} value={st.id}>{st.first_name} {st.last_name} ({st.class_allocated})</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Select Subject</label>
                <select value={form.subject_id} onChange={(e) => setForm({ ...form, subject_id: e.target.value })} required>
                  <option value="">-- Choose Subject --</option>
                  {subjects.map(s => <option key={s.id} value={s.id}>{s.name} ({s.code})</option>)}
                </select>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '1rem' }}>
                <div className="form-group">
                  <label>Marks Scored (%)</label>
                  <input type="number" placeholder="85" max="100" min="0" value={form.marks} onChange={(e) => setForm({ ...form, marks: e.target.value })} required />
                </div>
                <div className="form-group">
                  <label>Grade</label>
                  <select value={form.grade} onChange={(e) => setForm({ ...form, grade: e.target.value })}>
                    {['A', 'B', 'C', 'S', 'F'].map(gr => <option key={gr} value={gr}>{gr}</option>)}
                  </select>
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '1rem' }}>
                <div className="form-group">
                  <label>Exam Identifier</label>
                  <input type="text" placeholder="Mid-Term Exam" value={form.exam_name} onChange={(e) => setForm({ ...form, exam_name: e.target.value })} required />
                </div>
                <div className="form-group">
                  <label>Exam Date</label>
                  <input type="date" value={form.exam_date} onChange={(e) => setForm({ ...form, exam_date: e.target.value })} required />
                </div>
              </div>
              <button type="submit" className="btn-primary" style={{ justifyContent: 'center', marginTop: '1rem' }}><CheckCircle size={18} /> Publish to Portal</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
