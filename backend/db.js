const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("./database.db");

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nome TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL,
      role TEXT NOT NULL
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS alunos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nome TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS palavras_chave (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      termo TEXT NOT NULL UNIQUE
    )
  `);

  db.run(`
  CREATE TABLE IF NOT EXISTS propostas (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    titulo TEXT NOT NULL,
    descricao TEXT NOT NULL,
    orientador_id INTEGER NOT NULL,
    FOREIGN KEY (orientador_id) REFERENCES users(id)
  )
`);

db.run(`
  CREATE TABLE IF NOT EXISTS proposta_coorientadores (
    proposta_id INTEGER,
    user_id INTEGER,
    PRIMARY KEY (proposta_id, user_id),
    FOREIGN KEY (proposta_id) REFERENCES propostas(id),
    FOREIGN KEY (user_id) REFERENCES users(id)
  )
`);

db.run(`
  CREATE TABLE IF NOT EXISTS proposta_alunos (
    proposta_id INTEGER,
    aluno_id INTEGER,
    PRIMARY KEY (proposta_id, aluno_id),
    FOREIGN KEY (proposta_id) REFERENCES propostas(id),
    FOREIGN KEY (aluno_id) REFERENCES alunos(id)
  )
`);

db.run(`
  CREATE TABLE IF NOT EXISTS proposta_palavras_chave (
    proposta_id INTEGER,
    palavra_id INTEGER,
    PRIMARY KEY (proposta_id, palavra_id),
    FOREIGN KEY (proposta_id) REFERENCES propostas(id),
    FOREIGN KEY (palavra_id) REFERENCES palavras_chave(id)
  )
`);


  // Utilizadores iniciais
  db.get("SELECT COUNT(*) AS total FROM users", (err, row) => {
    if (row.total === 0) {
      db.run(
        "INSERT INTO users (nome, email, password, role) VALUES (?, ?, ?, ?)",
        ["Administrador", "admin@admin.pt", "admin", "ADMIN"]
      );

      db.run(
        "INSERT INTO users (nome, email, password, role) VALUES (?, ?, ?, ?)",
        ["Docente Teste", "docente@test.pt", "1234", "DOCENTE"]
      );
    }
  });
});

module.exports = db;
