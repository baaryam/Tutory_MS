import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import db from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import teacherRoutes from './routes/teacherRoutes.js';
import studentRoutes from './routes/studentRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5500;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/teacher', teacherRoutes);
app.use('/api/student', studentRoutes);

// Status route to check DB connection & tables
app.get('/api/status', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT 1 + 1 AS solution');
    const [[{ table_count }]] = await db.query(`
      SELECT COUNT(*) AS table_count 
      FROM information_schema.tables 
      WHERE table_schema = ?
    `, [process.env.DB_NAME || 'TutoryMS']);

    res.json({
      status: 'API is running',
      dbConnected: true,
      solution: rows[0].solution,
      databaseName: process.env.DB_NAME || 'TutoryMS',
      totalTables: table_count
    });
  } catch (error) {
    res.status(500).json({
      status: 'API is running, but database connection failed',
      error: error.message
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
