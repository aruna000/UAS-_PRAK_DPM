const jwt = require("jsonwebtoken");

module.exports = function (req, res, next) {
  const token = req.header("x-auth-token");
  if (!token) {
    return res.status(401).json({ msg: "Tidak ada token, otorisasi ditolak" });
  }

  try {
    const decoded = jwt.verify(
      token,
      "236240c157e0b54266f5adcf0aeb719b287a9297df953d4475a085bafa863e3b"
    );
    req.user = decoded.user;
    next();
  } catch (err) {
    res.status(401).json({ msg: "Token tidak valid" });
  }
};
