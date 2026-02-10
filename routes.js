const express = require("express");
const router = express.Router();
const sqlite3 = require("sqlite3").verbose();

const db = new sqlite3.Database("mes.db");

// ===============================
// ISSUE MATERIAL (already used)
// ===============================
router.post("/issue-material", (req, res) => {
  const { RM_ID, Qty, Production_Order, Operator } = req.body;

  const stmt = `
    INSERT INTO traceability 
    (RM_ID, Qty, Production_Order, Operator)
    VALUES (?, ?, ?, ?)
  `;

  db.run(stmt, [RM_ID, Qty, Production_Order, Operator], function (err) {
    if (err) return res.status(500).send("DB error");
    res.send("Material issued successfully");
  });
});

// ===============================
// ADMIN APIs (READ ONLY)
// ===============================

router.get("/admin/traceability", (req, res) => {
  db.all("SELECT * FROM traceability ORDER BY Timestamp DESC", [], (err, rows) => {
    if (err) return res.statu
