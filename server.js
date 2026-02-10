const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

// Initialize database (creates tables)
require("./database");

const routes = require("./routes");

const app = express();

app.use(cors());
app.use(bodyParser.json());

// All APIs will start with /api
app.use(express.static("public"));
app.use("/api", routes);


// Render assigns port dynamically
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("MES running on port", PORT);
});
