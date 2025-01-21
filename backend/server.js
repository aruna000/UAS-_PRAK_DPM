const express = require("express");
const connectDB = require("./config/db");
const cors = require("cors");

const app = express();

connectDB();

app.use(express.json({ extended: false }));

app.use(cors());

app.get("/", (req, res) => res.send("API Running"));

app.use("/api/auth", require("./routes/auth"));
app.use("/api/pendapatan", require("./routes/pendapatan"));
app.use("/api/pengeluaran", require("./routes/pengeluaran"));
app.use("/api/transfer", require("./routes/transfer"));
app.use("/api/aset", require("./routes/aset"));
app.use("/api/statistik", require("./routes/statistik"));
app.use("/api/memo", require("./routes/memo"));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
