const express = require("express");
const router = express.Router();
const db = require("../db");
const adminOnly = require("../middleware/adminOnly");

router.get("/", (req, res) => {
  db.all("SELECT * FROM palavras_chave", (err, rows) => {
    if (err) return res.status(500).json(err);
    res.json(rows);
  });
});

router.post("/", adminOnly, (req, res) => {
  const { termo } = req.body;

  db.run(
    "INSERT INTO palavras_chave (termo) VALUES (?)",
    [termo],
    function (err) {
      if (err) return res.status(500).json(err);
      res.json({ id: this.lastID });
    }
  );
});
router.delete("/:id", adminOnly, (req, res) => {
  db.run("DELETE FROM palavras_chave WHERE id = ?", [req.params.id], function (err) {
    if (err) return res.status(500).json(err);
    res.json({ deleted: this.changes });
  });
});


module.exports = router;
