const express = require('express');
const mysql = require('mysql2');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const path = require('path')
const passwordValidator = require('password-validator');

dotenv.config();

const app = express();
app.use(express.json());

// CORS configuration
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

const _dirname = path.dirname("")
const buildPath = path.join(_dirname ,"../frontend/build");

app.use(express.static(buildPath))

app.get("/*", function (req, res){
  
  res.sendFile(
    path.join(_dirname, "../frontend/build/index.html"),
    function (err) {
      if (err)
        res.status(500).send(err);
    }
  );
});

  const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  });

  db.connect((err) => {
    if (err) {
      console.error('Database connection failed:', err);
      return;
    }
    console.log('Database connected!');
  });

  const schema = new passwordValidator();
  schema
    .is().min(8)
    .is().max(100)
    .has().uppercase()
    .has().lowercase()
    .has().digits()
    .has().not().spaces();

  // Registration
  app.post('/register', async (req, res) => {
    const { email, password, name, gender, date_of_birth, company, contact_number } = req.body;

    // Validate password strength
    if (!schema.validate(password)) {
      return res.status(400).json({ message: 'Password does not meet strength requirements.' });
    }

    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      const sql = `INSERT INTO users (email, password, name, gender, date_of_birth, company, contact_number) VALUES (?, ?, ?, ?, ?, ?, ?)`;
      db.query(sql, [email, hashedPassword, name, gender, date_of_birth, company, contact_number], (err, result) => {
        if (err) {
          if (err.code === 'ER_DUP_ENTRY') {
            console.error('Error inserting data: Duplicate email entry');
            return res.status(400).json({ message: 'Email already exists' });
          } else {
            console.error('Error inserting data:', err);
            return res.status(500).json({ message: 'Internal server error' });
          }
        }

        // Generate JWT token
        const token = jwt.sign({ email, name }, process.env.JWT_SECRET, { expiresIn: '1h' });

        console.log('Data inserted successfully');
        res.status(201).json({ message: 'User registered successfully', token });
      });
    } catch (error) {
      console.error('Error during registration:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });


  // Login
  app.post('/login', (req, res) => {
    const { email, password } = req.body;
    console.log('Login Attempt:', { email, password });

    const sql = `SELECT * FROM users WHERE email = ?`;

    db.query(sql, [email], async (err, results) => {
      if (err) {
        console.log('Internal server error during login attempt:', { email });
        return res.status(500).send('Internal server error');
      }

      if (results.length === 0) {
        console.log('Login attempt failed: Email not found', { email });
        return res.status(401).json({ message: 'Email not found' });
      }

      const user = results[0];
      const isPasswordValid = 1; // Placeholder logic for password validation
      if (!isPasswordValid) {
        console.log('Login attempt failed: Incorrect password', { email });
        return res.status(401).json({ message: 'Password is incorrect' });
      }

      const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
      console.log('Login successful for user:', { email });
      res.json({ token });
    });
  });

  // Profile
  app.get('/profile/:email', (req, res) => {
    const email = req.params.email;
    const token = req.headers.authorization.split(' ')[1];

    try {
      jwt.verify(token, process.env.JWT_SECRET);

      const sql = `SELECT email, name, gender, date_of_birth, company, contact_number FROM users WHERE email = ?`;
      db.query(sql, [email], (err, results) => {
        if (err) {
          console.error('Error fetching user profile:', err);
          return res.status(500).send('Internal server error');
        }
        if (results.length === 0) {
          return res.status(404).send('User not found');
        }

        res.json(results[0]);
      });
    } catch (err) {
      return res.status(401).send('Unauthorized');
    }
  });




  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
