import db from '../config/db.js';

// Helper to get teacher record from user_id
const getTeacherFromUser = async (userId) => {
  const [rows] = await db.query('SELECT * FROM teachers WHERE user_id = ?', [userId]);
  return rows[0];
};

// Get teacher timetable schedule
export const getTeacherSchedule = async (req, res) => {
  try {
    const teacher = await getTeacherFromUser(req.user.id);
    if (!teacher) {
      return res.status(404).json({ message: 'Teacher profile not found' });
    }

    const [rows] = await db.query(`
      SELECT t.*, 
             c.name AS class_name, 
             s.name AS subject_name, s.code AS subject_code
      FROM timetable t
      JOIN classes c ON t.class_id = c.id
      JOIN subjects s ON t.subject_id = s.id
      WHERE t.teacher_id = ?
      ORDER BY FIELD(t.day_of_week, 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'), t.start_time
    `, [teacher.id]);

    res.json({ teacher, schedule: rows });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching schedule', error: error.message });
  }
};

// Get tasks assigned to this teacher
export const getTeacherTasks = async (req, res) => {
  try {
    const teacher = await getTeacherFromUser(req.user.id);
    if (!teacher) {
      return res.status(404).json({ message: 'Teacher profile not found' });
    }

    const [rows] = await db.query(`
      SELECT * FROM tasks 
      WHERE assigned_to_type = 'teacher' AND assigned_to_id = ?
      ORDER BY deadline ASC
    `, [teacher.id]);

    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching teacher tasks', error: error.message });
  }
};

// Update task status (e.g., mark Pending -> Completed)
export const updateTeacherTaskStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  try {
    const teacher = await getTeacherFromUser(req.user.id);
    if (!teacher) {
      return res.status(404).json({ message: 'Teacher profile not found' });
    }

    // Verify task belongs to this teacher
    const [task] = await db.query('SELECT * FROM tasks WHERE id = ? AND assigned_to_type = "teacher" AND assigned_to_id = ?', [id, teacher.id]);
    if (task.length === 0) {
      return res.status(403).json({ message: 'Access denied or task not found' });
    }

    await db.query('UPDATE tasks SET status = ? WHERE id = ?', [status, id]);
    res.json({ message: 'Task status updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error updating task status', error: error.message });
  }
};

// Get students in this teacher's classes (for grading)
export const getTeacherStudents = async (req, res) => {
  try {
    // Teachers are allocated classes. We can fetch all students whose class matches the teacher's classes list
    const teacher = await getTeacherFromUser(req.user.id);
    if (!teacher) {
      return res.status(404).json({ message: 'Teacher profile not found' });
    }

    // Split classes list (e.g., "Grade 10, Grade 11")
    const classList = teacher.classes.split(',').map(c => c.trim());
    if (classList.length === 0 || classList[0] === 'None') {
      return res.json([]);
    }

    // Query students in these classes
    const [rows] = await db.query(
      'SELECT id, first_name, last_name, class_allocated, email FROM students WHERE class_allocated IN (?) ORDER BY class_allocated, last_name',
      [classList]
    );

    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching students', error: error.message });
  }
};

// Get all exam results for students of this teacher
export const getTeacherExamResults = async (req, res) => {
  try {
    const teacher = await getTeacherFromUser(req.user.id);
    if (!teacher) {
      return res.status(404).json({ message: 'Teacher profile not found' });
    }

    const classList = teacher.classes.split(',').map(c => c.trim());
    if (classList.length === 0 || classList[0] === 'None') {
      return res.json([]);
    }

    const [rows] = await db.query(`
      SELECT er.*, 
             s.first_name AS student_first, s.last_name AS student_last, s.class_allocated,
             sb.name AS subject_name
      FROM exam_results er
      JOIN students s ON er.student_id = s.id
      JOIN subjects sb ON er.subject_id = sb.id
      WHERE s.class_allocated IN (?)
      ORDER BY er.exam_date DESC
    `, [classList]);

    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching exam results', error: error.message });
  }
};

// Publish exam result
export const publishExamResult = async (req, res) => {
  const { student_id, subject_id, marks, exam_name, grade, exam_date, published } = req.body;
  try {
    const [result] = await db.query(
      `INSERT INTO exam_results (student_id, subject_id, marks, exam_name, grade, exam_date, published)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [student_id, subject_id, marks, exam_name, grade, exam_date, published !== undefined ? published : true]
    );
    res.status(201).json({ id: result.insertId, message: 'Grade published successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error publishing grade', error: error.message });
  }
};
