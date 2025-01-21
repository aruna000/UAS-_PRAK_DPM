const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");
const auth = require("../middleware/auth");
const Pendapatan = require("../models/Pendapatan");
const Aset = require("../models/Aset");

router.post(
  "/",
  [
    auth,
    [
      check("tanggal", "Tanggal diperlukan").not().isEmpty(),
      check("total", "Total diperlukan").isNumeric(),
      check("kategori", "Kategori diperlukan").not().isEmpty(),
      check("aset", "Aset diperlukan").not().isEmpty(),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { tanggal, total, kategori, aset, catatan } = req.body;

    try {
      const newPendapatan = new Pendapatan({
        user: req.user.id,
        tanggal,
        total,
        kategori,
        aset,
        catatan,
      });

      const pendapatan = await newPendapatan.save();

      let asetData = await Aset.findOne({ user: req.user.id });
      if (!asetData) {
        asetData = new Aset({ user: req.user.id });
      }
      if (aset === "Bank") {
        asetData.bank += Number(total);
      } else if (aset === "Uang Tunai") {
        asetData.uang_tunai += Number(total);
      }
      await asetData.save();

      res.json(pendapatan);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
    }
  }
);

router.get("/", auth, async (req, res) => {
  try {
    const { tanggal } = req.query;
    const pendapatan = await Pendapatan.find({
      user: req.user.id,
      tanggal: {
        $gte: new Date(tanggal).setHours(0, 0, 0, 0),
        $lt: new Date(tanggal).setHours(23, 59, 59, 999),
      },
    });
    res.json(pendapatan);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

router.delete("/:id", auth, async (req, res) => {
  try {
    const pendapatan = await Pendapatan.findById(req.params.id);

    if (!pendapatan) {
      return res.status(404).json({ msg: "Pendapatan tidak ditemukan" });
    }

    if (pendapatan.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: "Tidak diizinkan" });
    }

    let asetData = await Aset.findOne({ user: req.user.id });
    if (!asetData) {
      return res.status(404).json({ msg: "Aset tidak ditemukan" });
    }
    if (pendapatan.aset === "Bank") {
      asetData.bank -= Number(pendapatan.total);
    } else if (pendapatan.aset === "Uang Tunai") {
      asetData.uang_tunai -= Number(pendapatan.total);
    }
    await asetData.save();

    await Pendapatan.deleteOne({ _id: req.params.id });

    res.json({ msg: "Pendapatan dihapus" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
