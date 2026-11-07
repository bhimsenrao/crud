const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// 1. Setup In-Memory DB (Lives in container RAM, zero file/permission issues)
const db = new sqlite3.Database(':memory:', (err) => {
  if (err) {
    console.error('In-memory database error:', err.message);
  } else {
    console.log('Connected to the in-memory SQLite database.');
  }
});

// 2. Initialize Table & Seed Sample Data sequentially
db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS accounts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    balance REAL
  )`);

  // Optional: Pre-populate with a sample record so the frontend shows data on boot
  db.run(`INSERT INTO accounts (name, balance) VALUES (?, ?)`, ['Demo Account', 1000]);
});

// CREATE
app.post('/accounts', (req, res) => {
  const { name, balance } = req.body;
  db.run('INSERT INTO accounts (name, balance) VALUES (?, ?)', [name, balance], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ id: this.lastID, name, balance });
  });
});

// READ (all)
app.get('/accounts', (req, res) => {
  db.all('SELECT * FROM accounts', [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// UPDATE
app.put('/accounts/:id', (req, res) => {
  const { name, balance } = req.body;
  db.run('UPDATE accounts SET name = ?, balance = ? WHERE id = ?', [name, balance, req.params.id], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ updated: this.changes });
  });
});

// DELETE
app.delete('/accounts/:id', (req, res) => {
  db.run('DELETE FROM accounts WHERE id = ?', [req.params.id], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ deleted: this.changes });
  });
});

// 3. Use process.env.PORT for cloud container compatibility, fallback to 5000 locally
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
