const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const path = require("path");

// init DB
require("./database");

const routes = require("./routes");

const app = express();

app.use(cors());
app.use(bodyParser.json());

// ✅ SAFE static path (ABSOLUTE)
app.use(express.static(path.join(__dirname, "public")));

// APIs
app.use("/api", routes);

// root route safety
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// admin route safety
app.get("/admin", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "admin.html"));
});

// Render port
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("MES running on port", PORT);
});
