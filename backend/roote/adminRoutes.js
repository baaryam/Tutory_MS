import express from 'express';
import { verifyToken } from '../middleware/authMiddleware.js';
import {
  getStats,
  getClasses, createClass, updateClass, deleteClass,
  getSubjects, createSubject, updateSubject, deleteSubject,
  getTimetable, createTimetableEntry, deleteTimetableEntry,
  getTasks, createTask, updateTask, deleteTask,
  getPayments, createPayment, updatePayment, deletePayment,
  getExamResults, createExamResult, updateExamResult, deleteExamResult,
  getStudents, getTeachers, getStaff
} from '../controllers/adminController.js';

const router = express.Router();

// Apply auth middleware to all admin routes
router.use(verifyToken);

// Stats
router.get('/stats', getStats);

// Classes
router.get('/classes', getClasses);
router.post('/classes', createClass);
router.put('/classes/:id', updateClass);
router.delete('/classes/:id', deleteClass);

// Subjects
router.get('/subjects', getSubjects);
router.post('/subjects', createSubject);
router.put('/subjects/:id', updateSubject);
router.delete('/subjects/:id', deleteSubject);

// Timetable
router.get('/timetable', getTimetable);
router.post('/timetable', createTimetableEntry);
router.delete('/timetable/:id', deleteTimetableEntry);

// Tasks
router.get('/tasks', getTasks);
router.post('/tasks', createTask);
router.put('/tasks/:id', updateTask);
router.delete('/tasks/:id', deleteTask);

// Payments
router.get('/payments', getPayments);
router.post('/payments', createPayment);
router.put('/payments/:id', updatePayment);
router.delete('/payments/:id', deletePayment);

// Exam Results
router.get('/exam-results', getExamResults);
router.post('/exam-results', createExamResult);
router.put('/exam-results/:id', updateExamResult);
router.delete('/exam-results/:id', deleteExamResult);

// Directories
router.get('/students', getStudents);
router.get('/teachers', getTeachers);
router.get('/staff', getStaff);

export default router;
