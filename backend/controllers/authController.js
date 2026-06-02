import db from '../config/db.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// User Registration (Sign Up)
export const register = async (req, res) => {
  const { 
    username, 
    email, 
    password, 
    role,
    firstName,
    lastName,
    phone,
    // Teacher specific
    subjects,
    classes,
    availability,
    // Student specific
    classAllocated,
    parentName,
    parentPhone,
    parentEmail,
    // Staff/Manager specific
    designation,
    department
  } = req.body;

  try {
    // Check if user already exists
    const [existingUsers] = await db.query('SELECT * FROM users WHERE email = ? OR username = ?', [email, username]);
    if (existingUsers.length > 0) {
      return res.status(400).json({ message: 'User with that email or username already exists' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // Validate role
    const userRole = role || 'student'; // Default to student
    if (!['admin', 'manager', 'teacher', 'student'].includes(userRole)) {
      return res.status(400).json({ message: 'Invalid role specified' });
    }

    // Insert user into database
    const [result] = await db.query(
      'INSERT INTO users (username, email, password_hash, role) VALUES (?, ?, ?, ?)',
      [username, email, passwordHash, userRole]
    );

    const userId = result.insertId;

    const fName = firstName || username;
    const lName = lastName || '';
    const ph = phone || '0000000000';

    // Insert into corresponding profile table
    if (userRole === 'manager' || userRole === 'admin') {
      await db.query(
        'INSERT INTO staff (user_id, first_name, last_name, email, phone, designation, department) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [
          userId, 
          fName, 
          lName, 
          email, 
          ph, 
          designation || (userRole === 'admin' ? 'Administrator' : 'Operations Manager'), 
          department || 'Administration'
        ]
      );
    } else if (userRole === 'teacher') {
      await db.query(
        'INSERT INTO teachers (user_id, first_name, last_name, email, phone, subjects, classes, availability) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
        [
          userId, 
          fName, 
          lName, 
          email, 
          ph, 
          subjects || 'General', 
          classes || 'None', 
          availability || 'Monday, Wednesday, Friday'
        ]
      );
    } else if (userRole === 'student') {
      await db.query(
        'INSERT INTO students (user_id, first_name, last_name, email, phone, class_allocated, parent_name, parent_phone, parent_email) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [
          userId, 
          fName, 
          lName, 
          email, 
          ph, 
          classAllocated || 'Grade 10', 
          parentName || 'Parent Name', 
          parentPhone || '0000000000', 
          parentEmail || 'parent@school.com'
        ]
      );
    }

    // Create JWT token
    const token = jwt.sign(
      { id: userId, role: userRole },
      process.env.JWT_SECRET || 'supersecretjwtkey_change_me_in_production',
      { expiresIn: '1d' }
    );

    res.status(201).json({
      message: 'Registration successful',
      token,
      user: { id: userId, username, email, role: userRole }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error during registration' });
  }
};

// User Login
export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find user by email
    const [users] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
    if (users.length === 0) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const user = users[0];

    // Check password
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Create JWT token
    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET || 'supersecretjwtkey_change_me_in_production',
      { expiresIn: '1d' }
    );

    res.json({
      message: 'Login successful',
      token,
      user: { id: user.id, username: user.username, email: user.email, role: user.role }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
};

// Get profile of authenticated user
export const getMe = async (req, res) => {
  const { id, role } = req.user;

  try {
    let profileData = {};
    if (role === 'admin' || role === 'manager') {
      const [rows] = await db.query('SELECT * FROM staff WHERE user_id = ?', [id]);
      profileData = rows[0] || {};
    } else if (role === 'teacher') {
      const [rows] = await db.query('SELECT * FROM teachers WHERE user_id = ?', [id]);
      profileData = rows[0] || {};
    } else if (role === 'student') {
      const [rows] = await db.query('SELECT * FROM students WHERE user_id = ?', [id]);
      profileData = rows[0] || {};
    }

    res.json({
      id,
      role,
      profile: profileData
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ message: 'Server error getting user profile' });
  }
};
