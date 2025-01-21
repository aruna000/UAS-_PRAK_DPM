const mongoose = require("mongoose");

const AsetSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  uang_tunai: {
    type: Number,
    default: 0,
  },
  bank: {
    type: Number,
    default: 0,
  },
});

module.exports = mongoose.model("Aset", AsetSchema);
