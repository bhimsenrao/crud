const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Setup DB
const db = new sqlite3.Database('./bank.db');
db.run(`CREATE TABLE IF NOT EXISTS accounts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT,
  balance REAL
)`);

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

app.listen(5000, () => console.log('Server running on port 5000'));