const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Connessione al database SQLite
const db = new sqlite3.Database('./database.sqlite', (err) => {
  if (err) {
    console.error(err.message);
  }
  console.log('Connected to the voti bar database.');
});

// Endpoint per ottenere tutti i bar
app.get('/bars', (req, res) => {
  db.all('SELECT * FROM bars', [], (err, rows) => {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

// Endpoint per aggiungere un nuovo bar
app.post('/bars', (req, res) => {
  const { nome, indirizzo } = req.body;
  db.run('INSERT INTO bars (nome, indirizzo) VALUES (?, ?)', [nome, indirizzo], (err) => {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.json({ message: 'Bar aggiunto con successo.' });
  });
});

// Endpoint per ottenere tutte le votazioni
app.get('/votazioni', (req, res) => {
  db.all('SELECT * FROM votazioni', [], (err, rows) => {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

// Endpoint per aggiungere una nuova votazione
app.post('/votazioni', (req, res) => {
  const { barId, voto } = req.body;
  db.run('INSERT INTO votazioni (barId, voto) VALUES (?, ?)', [barId, voto], (err) => {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.json({ message: 'Votazione aggiunta con successo.' });
  });
});

// Avvio del server
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
