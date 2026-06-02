import express from 'express';
import { verifyToken } from '../middleware/authMiddleware.js';
import {
  getTeacherSchedule,
  getTeacherTasks,
  updateTeacherTaskStatus,
  getTeacherStudents,
  getTeacherExamResults,
  publishExamResult
} from '../controllers/teacherController.js';

const router = express.Router();

// Apply auth middleware to all teacher routes
router.use(verifyToken);

router.get('/schedule', getTeacherSchedule);
router.get('/tasks', getTeacherTasks);
router.put('/tasks/:id/status', updateTeacherTaskStatus);
router.get('/students', getTeacherStudents);
router.get('/exam-results', getTeacherExamResults);
router.post('/exam-results', publishExamResult);

export default router;
