const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/auth", require("./routes/auth"));
app.use("/api/users", require("./routes/users"));
app.use("/api/alunos", require("./routes/alunos"));
app.use("/api/palavras-chave", require("./routes/palavrasChave"));
app.use("/api/propostas", require("./routes/propostas"));
app.use("/api/public", require("./routes/public"));




app.get("/api/health", (req, res) => {
  res.json({ status: "API a funcionar" });
});

app.listen(3000, () => {
  console.log("API a correr em http://localhost:3000");
});
