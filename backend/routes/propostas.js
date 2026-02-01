const express = require("express");
const router = express.Router();
const db = require("../db");

// Criar proposta
router.post("/", (req, res) => {
  const {
    titulo,
    descricao,
    orientadorId,
    coorientadores,
    alunos,
    palavrasChave
  } = req.body;

  db.run(
    "INSERT INTO propostas (titulo, descricao, orientador_id, created_at) VALUES (?, ?, ?, datetime('now'))",
    [titulo, descricao, orientadorId],
    function (err) {
      if (err) return res.status(500).json(err);

      const propostaId = this.lastID;

      coorientadores.forEach(id => {
        db.run("INSERT INTO proposta_coorientadores VALUES (?, ?)", [propostaId, id]);
      });

      alunos.forEach(id => {
        db.run("INSERT INTO proposta_alunos VALUES (?, ?)", [propostaId, id]);
      });

      palavrasChave.forEach(id => {
        db.run("INSERT INTO proposta_palavras_chave VALUES (?, ?)", [propostaId, id]);
      });

      res.json({ id: propostaId });
    }
  );
});

// Propostas do docente
router.get("/docente/:id", (req, res) => {
  db.all(
    "SELECT * FROM propostas WHERE orientador_id = ?",
    [req.params.id],
    (err, rows) => {
      if (err) return res.status(500).json(err);
      res.json(rows);
    }
  );
});

// Todas as propostas (ADMIN)
router.get("/", (req, res) => {
  db.all(`
    SELECT p.id, p.titulo, p.descricao, u.nome AS orientador
    FROM propostas p
    JOIN users u ON p.orientador_id = u.id
  `, (err, rows) => {
    if (err) return res.status(500).json(err);
    res.json(rows);
  });
});

router.get("/", (req, res) => {
  db.all(
    `SELECT p.id, p.titulo, p.descricao, u.nome AS orientador
     FROM propostas p
     JOIN users u ON p.orientador_id = u.id`,
    (err, rows) => {
      if (err) return res.status(500).json(err);
      res.json(rows);
    }
  );
});

router.put("/:id", (req, res) => {
  const propostaId = req.params.id;
  const {
    titulo,
    descricao,
    coorientadores = [],
    alunos = [],
    palavrasChave = []
  } = req.body;

  db.run(
    `
    UPDATE propostas
    SET titulo = ?, descricao = ?
    WHERE id = ?
    `,
    [titulo, descricao, propostaId],
    function (err) {
      if (err) return res.status(500).json(err);

      //  agora atualizar relações

            db.run(
        "DELETE FROM proposta_coorientadores WHERE proposta_id = ?",
        [propostaId],
        () => {

                    coorientadores.forEach(id => {
            db.run(
              "INSERT INTO proposta_coorientadores (proposta_id, user_id) VALUES (?, ?)",
              [propostaId, id]
            );
          });

                    db.run(
            "DELETE FROM proposta_palavras_chave WHERE proposta_id = ?",
            [propostaId],
            () => {
              palavrasChave.forEach(id => {
                db.run(
                  "INSERT INTO proposta_palavras_chave (proposta_id, palavra_id) VALUES (?, ?)",
                  [propostaId, id]
                );
              });
              db.run(
                "DELETE FROM proposta_alunos WHERE proposta_id = ?",
                [propostaId],
                () => {
                  alunos.forEach(id => {
                    db.run(
                      "INSERT INTO proposta_alunos (proposta_id, aluno_id) VALUES (?, ?)",
                      [propostaId, id]
                    );
                  });

                  res.json({ success: true });
                }
              );
            }
          );
        }
      );
    }
  );
});

    

// Apagar proposta (docente)
router.delete("/:id", (req, res) => {
  const propostaId = req.params.id;

  db.run(
    "DELETE FROM propostas WHERE id = ?",
    [propostaId],
    function (err) {
      if (err) {
        console.error("Erro ao apagar proposta:", err.message);
        return res.status(500).json({ error: err.message });
      }

      if (this.changes === 0) {
        return res.status(404).json({ error: "Proposta não encontrada" });
      }

      res.json({ deleted: this.changes });
    }
  );
});


// Detalhes completos de uma proposta
router.get("/:id/detalhes", (req, res) => {
  const propostaId = req.params.id;

  db.get(
  `
    SELECT
      p.id,
      p.titulo,
      p.descricao,
      p.created_at,
      u.id AS orientador_id,
      u.nome AS orientador_nome,
      u.email AS orientador_email
    FROM propostas p
    JOIN users u ON u.id = p.orientador_id
    WHERE p.id = ?
    `,
    [propostaId],
    (err, proposta) => {
      if (err) {
        console.error(err.message);
        return res.status(500).json({ error: err.message });
      }

      if (!proposta) {
        return res.status(404).json({ error: "Proposta não encontrada" });
      }

      // Agora buscar relações (coorientadores, alunos, palavras-chave)
      db.all(
        `
        SELECT u.id, u.nome, u.email
        FROM proposta_coorientadores pc
        JOIN users u ON u.id = pc.user_id
        WHERE pc.proposta_id = ?
        `,
        [propostaId],
        (err, coorientadores) => {
          if (err) return res.status(500).json({ error: err.message });

          db.all(
            `
            SELECT a.id, a.nome, a.email
            FROM proposta_alunos pa
            JOIN alunos a ON a.id = pa.aluno_id
            WHERE pa.proposta_id = ?
            `,
            [propostaId],
            (err, alunos) => {
              if (err) return res.status(500).json({ error: err.message });

              db.all(
                `
                SELECT p.id, p.termo
                FROM proposta_palavras_chave pp
                JOIN palavras_chave p ON p.id = pp.palavra_id
                WHERE pp.proposta_id = ?
                `,
                [propostaId],
                (err, palavrasChave) => {
                  if (err) return res.status(500).json({ error: err.message });

                  res.json({
                    id: proposta.id,
                    titulo: proposta.titulo,
                    descricao: proposta.descricao,
                    created_at: proposta.created_at,
                    orientador: {
                      id: proposta.orientador_id,
                      nome: proposta.orientador_nome,
                      email: proposta.orientador_email
                    },
                    coorientadores,
                    alunos,
                    palavrasChave
                  });
                }
              );
            }
          );
        }
      );
    }
  );
});


module.exports = router;
