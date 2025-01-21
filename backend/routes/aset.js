const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const Aset = require("../models/Aset");

router.get("/", auth, async (req, res) => {
  try {
    const aset = await Aset.findOne({ user: req.user.id });
    if (!aset) {
      return res.status(404).json({ msg: "Aset tidak ditemukan" });
    }
    res.json(aset);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
