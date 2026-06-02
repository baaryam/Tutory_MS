import db from '../config/db.js';

// Helper to get student from user_id
const getStudentFromUser = async (userId) => {
  const [rows] = await db.query('SELECT * FROM students WHERE user_id = ?', [userId]);
  return rows[0];
};

// Get student's class timetable
export const getStudentSchedule = async (req, res) => {
  try {
    const student = await getStudentFromUser(req.user.id);
    if (!student) {
      return res.status(404).json({ message: 'Student profile not found' });
    }

    if (!student.class_allocated) {
      return res.json({ student, schedule: [] });
    }

    const [rows] = await db.query(`
      SELECT t.*, 
             s.name AS subject_name, s.code AS subject_code,
             tc.first_name AS teacher_first, tc.last_name AS teacher_last
      FROM timetable t
      JOIN classes c ON t.class_id = c.id
      JOIN subjects s ON t.subject_id = s.id
      JOIN teachers tc ON t.teacher_id = tc.id
      WHERE c.name = ?
      ORDER BY FIELD(t.day_of_week, 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'), t.start_time
    `, [student.class_allocated]);

    res.json({ student, schedule: rows });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching schedule', error: error.message });
  }
};

// Get student's published exam results
export const getStudentGrades = async (req, res) => {
  try {
    const student = await getStudentFromUser(req.user.id);
    if (!student) {
      return res.status(404).json({ message: 'Student profile not found' });
    }

    const [rows] = await db.query(`
      SELECT er.*, sb.name AS subject_name, sb.code AS subject_code
      FROM exam_results er
      JOIN subjects sb ON er.subject_id = sb.id
      WHERE er.student_id = ? AND er.published = true
      ORDER BY er.exam_date DESC
    `, [student.id]);

    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching grades', error: error.message });
  }
};

// Get student's fee invoices / payment records
export const getStudentPayments = async (req, res) => {
  try {
    const student = await getStudentFromUser(req.user.id);
    if (!student) {
      return res.status(404).json({ message: 'Student profile not found' });
    }

    const [rows] = await db.query(`
      SELECT * FROM payments 
      WHERE student_id = ? 
      ORDER BY payment_date DESC, id DESC
    `, [student.id]);

    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching payments', error: error.message });
  }
};

// Pay Simulated Fee Invoice
export const payInvoice = async (req, res) => {
  const { id } = req.params;
  const { payment_method, transaction_id } = req.body;
  try {
    const student = await getStudentFromUser(req.user.id);
    if (!student) {
      return res.status(404).json({ message: 'Student profile not found' });
    }

    // Verify invoice belongs to student and is Pending
    const [invoice] = await db.query('SELECT * FROM payments WHERE id = ? AND student_id = ? AND status = "Pending"', [id, student.id]);
    if (invoice.length === 0) {
      return res.status(404).json({ message: 'Invoice not found or already paid' });
    }

    await db.query(
      `UPDATE payments 
       SET status = 'Completed', 
           payment_method = ?, 
           transaction_id = ?, 
           payment_date = NOW() 
       WHERE id = ?`,
      [payment_method || 'Online Card', transaction_id || `TXN${Date.now()}`, id]
    );

    res.json({ message: 'Payment successfully processed!' });
  } catch (error) {
    res.status(500).json({ message: 'Error processing simulated payment', error: error.message });
  }
};
