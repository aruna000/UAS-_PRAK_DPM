const mongoose = require("mongoose");

const TransferSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  tanggal: {
    type: Date,
    required: true,
  },
  total: {
    type: Number,
    required: true,
  },
  dari_aset: {
    type: String,
    required: true,
  },
  ke_aset: {
    type: String,
    required: true,
  },
  catatan: {
    type: String,
  },
});

module.exports = mongoose.model("Transfer", TransferSchema);
