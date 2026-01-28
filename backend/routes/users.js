const express = require("express");
const router = express.Router();
const db = require("../db");
const adminOnly = require("../middleware/adminOnly");

router.get("/", (req, res) => {
  db.all("SELECT id, nome, email, role FROM users", (err, rows) => {
    if (err) return res.status(500).json(err);
    res.json(rows);
  });
});

router.post("/", adminOnly, (req, res) => {
  const { nome, email, password, role } = req.body;

  db.run(
    "INSERT INTO users (nome, email, password, role) VALUES (?, ?, ?, ?)",
    [nome, email, password, role],
    function (err) {
      if (err) return res.status(500).json(err);
      res.json({ id: this.lastID });
    }
  );
});

router.delete("/:id", adminOnly, (req, res) => {
  db.run(
    "DELETE FROM users WHERE id = ?",
    [req.params.id],
    function (err) {
      if (err) return res.status(500).json(err);
      res.json({ deleted: this.changes });
    }
  );
});

module.exports = router;
