const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");
const auth = require("../middleware/auth");
const Memo = require("../models/Memo");

router.post(
  "/",
  [auth, [check("catatan", "Catatan diperlukan").not().isEmpty()]],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { catatan } = req.body;

    try {
      const newMemo = new Memo({
        user: req.user.id,
        catatan,
      });

      const memo = await newMemo.save();
      res.json(memo);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
    }
  }
);

router.get("/", auth, async (req, res) => {
  try {
    const memos = await Memo.find({ user: req.user.id }).sort({
      tanggal_dibuat: -1,
    });
    res.json(memos);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// Update memo
router.put("/:id", auth, async (req, res) => {
  const { catatan } = req.body;

  try {
    let memo = await Memo.findById(req.params.id);

    if (!memo) return res.status(404).json({ msg: "Memo tidak ditemukan" });

    if (memo.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: "Tidak diizinkan" });
    }

    const result = await Memo.updateOne(
      { _id: req.params.id },
      { $set: { catatan } }
    );

    if (result.nModified === 0) {
      return res.status(400).json({ msg: "Memo tidak diperbarui" });
    }

    memo = await Memo.findById(req.params.id);
    res.json(memo);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// Delete memo
router.delete("/:id", auth, async (req, res) => {
  try {
    const memo = await Memo.findById(req.params.id);

    if (!memo) {
      return res.status(404).json({ msg: "Memo tidak ditemukan" });
    }

    if (memo.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: "Tidak diizinkan" });
    }

    await Memo.deleteOne({ _id: req.params.id });

    res.json({ msg: "Memo dihapus" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
