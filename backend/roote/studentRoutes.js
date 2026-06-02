import express from 'express';
import { verifyToken } from '../middleware/authMiddleware.js';
import {
  getStudentSchedule,
  getStudentGrades,
  getStudentPayments,
  payInvoice
} from '../controllers/studentController.js';

const router = express.Router();

// Apply auth middleware to all student routes
router.use(verifyToken);

router.get('/schedule', getStudentSchedule);
router.get('/grades', getStudentGrades);
router.get('/payments', getStudentPayments);
router.post('/payments/:id/pay', payInvoice);

export default router;
