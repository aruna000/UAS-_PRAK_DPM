const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const Pengeluaran = require("../models/Pengeluaran");

router.get("/", auth, async (req, res) => {
  try {
    const pengeluaran = await Pengeluaran.aggregate([
      { $match: { user: req.user.id } },
      { $group: { _id: "$kategori", total: { $sum: "$total" } } },
      { $sort: { total: -1 } },
    ]);
    res.json(pengeluaran);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
