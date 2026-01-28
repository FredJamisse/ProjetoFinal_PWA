module.exports = function adminOnly(req, res, next) {
  const role = req.headers["x-user-role"];

  if (role !== "ADMIN") {
    return res.status(403).json({ error: "Acesso restrito ao administrador" });
  }

  next();
};
