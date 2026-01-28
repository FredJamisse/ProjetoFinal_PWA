const express = require("express");
const router = express.Router();
const db = require("../db");

// Docentes que têm propostas
router.get("/docentes", (req, res) => {
  db.all(
    `
    SELECT 
      u.id,
      u.nome,
      u.email,
      COUNT(p.id) AS totalPropostas,
      GROUP_CONCAT(DISTINCT pk.termo) AS palavrasChave
    FROM users u
    JOIN propostas p ON p.orientador_id = u.id
    LEFT JOIN proposta_palavras_chave ppk ON ppk.proposta_id = p.id
    LEFT JOIN palavras_chave pk ON pk.id = ppk.palavra_id
    GROUP BY u.id
    `,
    (err, rows) => {
      if (err) return res.status(500).json(err);

      const resultado = rows.map(r => ({
        ...r,
        palavrasChave: r.palavrasChave ? r.palavrasChave.split(",") : []
      }));

      res.json(resultado);
    }
  );
});

// Propostas públicas de um docente
router.get("/docentes/:id/propostas", (req, res) => {
  const docenteId = req.params.id;

  db.all(
    `SELECT id, titulo, created_at
     FROM propostas
     WHERE orientador_id = ?`,
    [docenteId],
    (err, rows) => {
      if (err) {
        console.error("ERRO SQLITE:", err.message);
        return res.status(500).json({
          erro: err.message,
          code: err.code
        });
      }
      res.json(rows);
    }
  );
});




// Detalhes públicos de uma proposta
// Detalhes públicos de uma proposta (com coorientadores)
router.get("/propostas/:id/detalhes", (req, res) => {
  const propostaId = req.params.id;

  db.get(
    `SELECT p.id, p.titulo, p.descricao, u.nome AS orientador
     FROM propostas p
     JOIN users u ON u.id = p.orientador_id
     WHERE p.id = ?`,
    [propostaId],
    (err, proposta) => {
      if (err) return res.status(500).json(err);
      if (!proposta) return res.status(404).json({ error: "Proposta não encontrada" });

      //  Coorientadores
      db.all(
        `SELECT u.id, u.nome, u.email
         FROM proposta_coorientadores pc
         JOIN users u ON u.id = pc.user_id
         WHERE pc.proposta_id = ?`,
        [propostaId],
        (err2, coorientadores) => {
          if (err2) return res.status(500).json(err2);

          //  Palavras-chave
          db.all(
            `SELECT pk.termo
             FROM proposta_palavras_chave ppk
             JOIN palavras_chave pk ON pk.id = ppk.palavra_id
             WHERE ppk.proposta_id = ?`,
            [propostaId],
            (err3, palavras) => {
              if (err3) return res.status(500).json(err3);

              res.json({
                ...proposta,
                coorientadores,
                palavras
              });
            }
          );
        }
      );
    }
  );
});


// Palavras-chave públicas (para filtros)
router.get("/palavras-chave", (req, res) => {
  db.all("SELECT id, termo FROM palavras_chave", (err, rows) => {
    if (err) return res.status(500).json(err);
    res.json(rows);
  });
});

// Informação pública do docente
router.get("/docentes/:id", (req, res) => {
  db.get(
    "SELECT id, nome, email FROM users WHERE id = ?",
    [req.params.id],
    (err, row) => {
      if (err) return res.status(500).json(err);
      if (!row) return res.status(404).json({ error: "Docente não encontrado" });
      res.json(row);
    }
  );
});



module.exports = router;
