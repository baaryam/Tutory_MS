import db from '../config/db.js';
import bcrypt from 'bcryptjs';

// Get comprehensive dashboard statistics
export const getStats = async (req, res) => {
  try {
    const [[{ total_students }]] = await db.query('SELECT COUNT(*) AS total_students FROM students');
    const [[{ total_teachers }]] = await db.query('SELECT COUNT(*) AS total_teachers FROM teachers');
    const [[{ total_classes }]] = await db.query('SELECT COUNT(*) AS total_classes FROM classes');
    
    const [[{ total_tasks }]] = await db.query('SELECT COUNT(*) AS total_tasks FROM tasks');
    const [[{ pending_tasks }]] = await db.query("SELECT COUNT(*) AS pending_tasks FROM tasks WHERE status = 'Pending'");
    const [[{ completed_tasks }]] = await db.query("SELECT COUNT(*) AS completed_tasks FROM tasks WHERE status = 'Completed'");

    const [[{ collected_fees }]] = await db.query("SELECT SUM(amount) AS collected_fees FROM payments WHERE status = 'Completed'");
    const [[{ pending_fees }]] = await db.query("SELECT SUM(amount) AS pending_fees FROM payments WHERE status = 'Pending'");

    res.json({
      total_students,
      total_teachers,
      total_classes,
      tasks: {
        total: total_tasks,
        pending: pending_tasks,
        completed: completed_tasks
      },
      fees: {
        collected: collected_fees || 0,
        pending: pending_fees || 0
      }
    });
  } catch (error) {
    console.error('Error fetching admin stats:', error);
    res.status(500).json({ message: 'Server error fetching stats', error: error.message });
  }
};

// ==========================================
// CLASSES CRUD
// ==========================================
export const getClasses = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM classes ORDER BY name ASC');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching classes', error: error.message });
  }
};

export const createClass = async (req, res) => {
  const { name, classroom } = req.body;
  try {
    const [result] = await db.query('INSERT INTO classes (name, classroom) VALUES (?, ?)', [name, classroom]);
    res.status(201).json({ id: result.insertId, name, classroom });
  } catch (error) {
    res.status(500).json({ message: 'Error creating class', error: error.message });
  }
};

export const updateClass = async (req, res) => {
  const { id } = req.params;
  const { name, classroom } = req.body;
  try {
    await db.query('UPDATE classes SET name = ?, classroom = ? WHERE id = ?', [name, classroom, id]);
    res.json({ message: 'Class updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error updating class', error: error.message });
  }
};

export const deleteClass = async (req, res) => {
  const { id } = req.params;
  try {
    await db.query('DELETE FROM classes WHERE id = ?', [id]);
    res.json({ message: 'Class deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting class', error: error.message });
  }
};

// ==========================================
// SUBJECTS CRUD
// ==========================================
export const getSubjects = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM subjects ORDER BY name ASC');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching subjects', error: error.message });
  }
};

export const createSubject = async (req, res) => {
  const { name, code } = req.body;
  try {
    const [result] = await db.query('INSERT INTO subjects (name, code) VALUES (?, ?)', [name, code]);
    res.status(201).json({ id: result.insertId, name, code });
  } catch (error) {
    res.status(500).json({ message: 'Error creating subject', error: error.message });
  }
};

export const updateSubject = async (req, res) => {
  const { id } = req.params;
  const { name, code } = req.body;
  try {
    await db.query('UPDATE subjects SET name = ?, code = ? WHERE id = ?', [name, code, id]);
    res.json({ message: 'Subject updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error updating subject', error: error.message });
  }
};

export const deleteSubject = async (req, res) => {
  const { id } = req.params;
  try {
    await db.query('DELETE FROM subjects WHERE id = ?', [id]);
    res.json({ message: 'Subject deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting subject', error: error.message });
  }
};

// ==========================================
// TIMETABLE CRUD
// ==========================================
export const getTimetable = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT t.*, 
             c.name AS class_name, 
             s.name AS subject_name, s.code AS subject_code,
             tc.first_name AS teacher_first, tc.last_name AS teacher_last
      FROM timetable t
      JOIN classes c ON t.class_id = c.id
      JOIN subjects s ON t.subject_id = s.id
      JOIN teachers tc ON t.teacher_id = tc.id
      ORDER BY FIELD(t.day_of_week, 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'), t.start_time
    `);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching timetable', error: error.message });
  }
};

export const createTimetableEntry = async (req, res) => {
  const { class_id, subject_id, teacher_id, day_of_week, start_time, end_time, classroom } = req.body;
  try {
    const [result] = await db.query(
      `INSERT INTO timetable (class_id, subject_id, teacher_id, day_of_week, start_time, end_time, classroom)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [class_id, subject_id, teacher_id, day_of_week, start_time, end_time, classroom]
    );
    res.status(201).json({ id: result.insertId, message: 'Timetable entry created' });
  } catch (error) {
    res.status(500).json({ message: 'Error creating timetable entry', error: error.message });
  }
};

export const deleteTimetableEntry = async (req, res) => {
  const { id } = req.params;
  try {
    await db.query('DELETE FROM timetable WHERE id = ?', [id]);
    res.json({ message: 'Timetable entry deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting timetable entry', error: error.message });
  }
};

// ==========================================
// TASKS CRUD
// ==========================================
export const getTasks = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM tasks ORDER BY deadline ASC');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching tasks', error: error.message });
  }
};

export const createTask = async (req, res) => {
  const { title, description, assigned_to_type, assigned_to_id, status, priority, deadline } = req.body;
  try {
    const [result] = await db.query(
      `INSERT INTO tasks (title, description, assigned_to_type, assigned_to_id, status, priority, deadline)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [title, description, assigned_to_type, assigned_to_id, status || 'Pending', priority || 'Medium', deadline]
    );
    res.status(201).json({ id: result.insertId, message: 'Task created successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error creating task', error: error.message });
  }
};

export const updateTask = async (req, res) => {
  const { id } = req.params;
  const { title, description, assigned_to_type, assigned_to_id, status, priority, deadline } = req.body;
  try {
    await db.query(
      `UPDATE tasks SET title = ?, description = ?, assigned_to_type = ?, assigned_to_id = ?, status = ?, priority = ?, deadline = ?
       WHERE id = ?`,
      [title, description, assigned_to_type, assigned_to_id, status, priority, deadline, id]
    );
    res.json({ message: 'Task updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error updating task', error: error.message });
  }
};

export const deleteTask = async (req, res) => {
  const { id } = req.params;
  try {
    await db.query('DELETE FROM tasks WHERE id = ?', [id]);
    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting task', error: error.message });
  }
};

// ==========================================
// PAYMENTS CRUD
// ==========================================
export const getPayments = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT p.*, s.first_name, s.last_name, s.class_allocated
      FROM payments p
      JOIN students s ON p.student_id = s.id
      ORDER BY p.payment_date DESC, p.id DESC
    `);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching payments', error: error.message });
  }
};

export const createPayment = async (req, res) => {
  const { student_id, amount, description } = req.body;
  try {
    const [result] = await db.query(
      `INSERT INTO payments (student_id, amount, status, description)
       VALUES (?, ?, 'Pending', ?)`,
      [student_id, amount, description || 'Term Fee']
    );
    res.status(201).json({ id: result.insertId, message: 'Fee invoice created successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error creating payment record', error: error.message });
  }
};

export const updatePayment = async (req, res) => {
  const { id } = req.params;
  const { status, payment_method, transaction_id } = req.body;
  const date = status === 'Completed' ? new Date() : null;
  try {
    await db.query(
      `UPDATE payments SET status = ?, payment_method = ?, transaction_id = ?, payment_date = ?
       WHERE id = ?`,
      [status, payment_method || '', transaction_id || '', date, id]
    );
    res.json({ message: 'Payment status updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error updating payment', error: error.message });
  }
};

export const deletePayment = async (req, res) => {
  const { id } = req.params;
  try {
    await db.query('DELETE FROM payments WHERE id = ?', [id]);
    res.json({ message: 'Payment record deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting payment', error: error.message });
  }
};

// ==========================================
// EXAM RESULTS CRUD
// ==========================================
export const getExamResults = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT er.*, 
             s.first_name AS student_first, s.last_name AS student_last, s.class_allocated,
             sb.name AS subject_name, sb.code AS subject_code
      FROM exam_results er
      JOIN students s ON er.student_id = s.id
      JOIN subjects sb ON er.subject_id = sb.id
      ORDER BY er.exam_date DESC
    `);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching exam results', error: error.message });
  }
};

export const createExamResult = async (req, res) => {
  const { student_id, subject_id, marks, exam_name, grade, exam_date, published } = req.body;
  try {
    const [result] = await db.query(
      `INSERT INTO exam_results (student_id, subject_id, marks, exam_name, grade, exam_date, published)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [student_id, subject_id, marks, exam_name, grade, exam_date, published || false]
    );
    res.status(201).json({ id: result.insertId, message: 'Exam result created successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error creating exam result', error: error.message });
  }
};

export const updateExamResult = async (req, res) => {
  const { id } = req.params;
  const { marks, exam_name, grade, exam_date, published } = req.body;
  try {
    await db.query(
      `UPDATE exam_results SET marks = ?, exam_name = ?, grade = ?, exam_date = ?, published = ?
       WHERE id = ?`,
      [marks, exam_name, grade, exam_date, published, id]
    );
    res.json({ message: 'Exam result updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error updating exam result', error: error.message });
  }
};

export const deleteExamResult = async (req, res) => {
  const { id } = req.params;
  try {
    await db.query('DELETE FROM exam_results WHERE id = ?', [id]);
    res.json({ message: 'Exam result deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting exam result', error: error.message });
  }
};

// ==========================================
// USERS / STUDENTS / TEACHERS / STAFF DIRECTORY
// ==========================================
export const getStudents = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT s.*, u.username, u.email AS user_email
      FROM students s
      JOIN users u ON s.user_id = u.id
      ORDER BY s.last_name, s.first_name
    `);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching students list', error: error.message });
  }
};

export const getTeachers = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT t.*, u.username, u.email AS user_email
      FROM teachers t
      JOIN users u ON t.user_id = u.id
      ORDER BY t.last_name, t.first_name
    `);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching teachers list', error: error.message });
  }
};

export const getStaff = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT st.*, u.username, u.email AS user_email
      FROM staff st
      JOIN users u ON st.user_id = u.id
      ORDER BY st.last_name, st.first_name
    `);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching staff list', error: error.message });
  }
};
