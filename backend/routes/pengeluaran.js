const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");
const auth = require("../middleware/auth");
const Pengeluaran = require("../models/Pengeluaran");
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
      const newPengeluaran = new Pengeluaran({
        user: req.user.id,
        tanggal,
        total,
        kategori,
        aset,
        catatan,
      });

      const pengeluaran = await newPengeluaran.save();

      let asetData = await Aset.findOne({ user: req.user.id });
      if (!asetData) {
        asetData = new Aset({ user: req.user.id });
      }
      if (aset === "Bank") {
        asetData.bank -= Number(total);
      } else if (aset === "Uang Tunai") {
        asetData.uang_tunai -= Number(total);
      }
      await asetData.save();

      res.json(pengeluaran);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
    }
  }
);

router.get("/", auth, async (req, res) => {
  try {
    const { tanggal } = req.query;
    const pengeluaran = await Pengeluaran.find({
      user: req.user.id,
      tanggal: {
        $gte: new Date(tanggal).setHours(0, 0, 0, 0),
        $lt: new Date(tanggal).setHours(23, 59, 59, 999),
      },
    });
    res.json(pengeluaran);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

router.delete("/:id", auth, async (req, res) => {
  try {
    const pengeluaran = await Pengeluaran.findById(req.params.id);

    if (!pengeluaran) {
      return res.status(404).json({ msg: "Pengeluaran tidak ditemukan" });
    }

    if (pengeluaran.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: "Tidak diizinkan" });
    }

    let asetData = await Aset.findOne({ user: req.user.id });
    if (!asetData) {
      return res.status(404).json({ msg: "Aset tidak ditemukan" });
    }
    if (pengeluaran.aset === "Bank") {
      asetData.bank += Number(pengeluaran.total);
    } else if (pengeluaran.aset === "Uang Tunai") {
      asetData.uang_tunai += Number(pengeluaran.total);
    }
    await asetData.save();

    await Pengeluaran.deleteOne({ _id: req.params.id });

    res.json({ msg: "Pengeluaran dihapus" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
