const mongoose = require("mongoose");

const MemoSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  catatan: {
    type: String,
    required: true,
  },
  tanggal_dibuat: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Memo", MemoSchema);
