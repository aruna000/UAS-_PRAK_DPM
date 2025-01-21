const mongoose = require("mongoose");

const PendapatanSchema = new mongoose.Schema({
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
  kategori: {
    type: String,
    required: true,
  },
  aset: {
    type: String,
    required: true,
  },
  catatan: {
    type: String,
  },
});

module.exports = mongoose.model("Pendapatan", PendapatanSchema);
