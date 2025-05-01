const express = require('express');
const fs = require('fs');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const app = express();

app.use(cors());
app.use(express.json());

const SECRET_KEY = 'rahasia123';
const DB_FILE = './db.json';

function readDB() {
  return JSON.parse(fs.readFileSync(DB_FILE));
}

function writeDB(data) {
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
}

// Login Admin
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  const db = readDB();

  if (username === 'admin' && password === 'admin123') {
    const token = jwt.sign({ user: username }, SECRET_KEY, { expiresIn: '1h' });
    res.json({ success: true, token });
  } else {
    res.status(401).json({ success: false, message: 'Salah username/password' });
  }
});

// Get Posts
app.get('/posts', (req, res) => {
  const db = readDB();
  res.json(db.posts);
});

// Add Post
app.post('/posts', (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  try {
    jwt.verify(token, SECRET_KEY);
  } catch (e) {
    return res.status(401).json({ success: false, message: 'Token tidak valid' });
  }

  const { title, content } = req.body;
  const db = readDB();
  db.posts.push({ title, content });
  writeDB(db);
  res.json({ success: true });
});

app.listen(3000, () => console.log('Server berjalan di port 3000'));
