const express = require("express");
const router = express.Router();
const db = require("../db");

router.post("/login", (req, res) => {
  const { email, password } = req.body;

  db.get(
    "SELECT id, nome, role FROM users WHERE email = ? AND password = ?",
    [email, password],
    (err, user) => {
      if (err) return res.status(500).json(err);
      if (!user) return res.status(401).json({ error: "Credenciais inválidas" });

      res.json(user);
    }
  );
});

module.exports = router;
