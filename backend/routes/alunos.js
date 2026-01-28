const express = require("express");
const router = express.Router();
const db = require("../db");
const adminOnly = require("../middleware/adminOnly");

router.get("/", (req, res) => {
  db.all("SELECT * FROM alunos", (err, rows) => {
    if (err) return res.status(500).json(err);
    res.json(rows);
  });
});

router.post("/", adminOnly, (req, res) => {
  const { nome, email } = req.body;

  db.run(
    "INSERT INTO alunos (nome, email) VALUES (?, ?)",
    [nome, email],
    function (err) {
      if (err) return res.status(500).json(err);
      res.json({ id: this.lastID });
    }
  );
});
router.delete("/:id", adminOnly, (req, res) => {
  db.run("DELETE FROM alunos WHERE id = ?", [req.params.id], function (err) {
    if (err) return res.status(500).json(err);
    res.json({ deleted: this.changes });
  });
});


module.exports = router;
