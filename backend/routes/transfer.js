const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");
const auth = require("../middleware/auth");
const Transfer = require("../models/Transfer");
const Aset = require("../models/Aset");

router.post(
  "/",
  [
    auth,
    [
      check("tanggal", "Tanggal diperlukan").not().isEmpty(),
      check("total", "Total diperlukan").isNumeric(),
      check("dari_aset", "Dari aset diperlukan").not().isEmpty(),
      check("ke_aset", "Ke aset diperlukan").not().isEmpty(),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { tanggal, total, dari_aset, ke_aset, catatan } = req.body;

    try {
      const newTransfer = new Transfer({
        user: req.user.id,
        tanggal,
        total,
        dari_aset,
        ke_aset,
        catatan,
      });

      const transfer = await newTransfer.save();

      let asetData = await Aset.findOne({ user: req.user.id });
      if (!asetData) {
        asetData = new Aset({ user: req.user.id });
      }
      if (dari_aset === "Bank") {
        asetData.bank -= Number(total);
      } else if (dari_aset === "Uang Tunai") {
        asetData.uang_tunai -= Number(total);
      }
      if (ke_aset === "Bank") {
        asetData.bank += Number(total);
      } else if (ke_aset === "Uang Tunai") {
        asetData.uang_tunai += Number(total);
      }
      await asetData.save();

      res.json(transfer);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
    }
  }
);

router.get("/", auth, async (req, res) => {
  try {
    const { tanggal } = req.query;
    const transfer = await Transfer.find({
      user: req.user.id,
      tanggal: {
        $gte: new Date(tanggal).setHours(0, 0, 0, 0),
        $lt: new Date(tanggal).setHours(23, 59, 59, 999),
      },
    });
    res.json(transfer);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

router.delete("/:id", auth, async (req, res) => {
  try {
    const transfer = await Transfer.findById(req.params.id);

    if (!transfer) {
      return res.status(404).json({ msg: "Transfer tidak ditemukan" });
    }

    if (transfer.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: "Tidak diizinkan" });
    }

    let asetData = await Aset.findOne({ user: req.user.id });
    if (transfer.dari_aset === "Bank") {
      asetData.bank += Number(transfer.total);
    } else if (transfer.dari_aset === "Uang Tunai") {
      asetData.uang_tunai += Number(transfer.total);
    }
    if (transfer.ke_aset === "Bank") {
      asetData.bank -= Number(transfer.total);
    } else if (transfer.ke_aset === "Uang Tunai") {
      asetData.uang_tunai -= Number(transfer.total);
    }
    await asetData.save();

    const result = await Transfer.deleteOne({ _id: req.params.id });

    res.json({ msg: "Transfer dihapus", deletedCount: result.deletedCount });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
