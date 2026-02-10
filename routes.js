const express = require("express");
const router = express.Router();
const db = require("./database");

// ADD RAW MATERIAL
router.post("/raw-material", (req, res) => {
  const { RM_ID, Material_Type, Process, Batch_No, Balance_Qty } = req.body;

  db.run(
    `INSERT INTO RawMaterialMaster 
     (RM_ID, Material_Type, Process, Batch_No, Balance_Qty, Expiry_Date, Status)
     VALUES (?,?,?,?,?,?,?)`,
    [RM_ID, Material_Type, Process, Batch_No, Balance_Qty, "", "OK"],
    (err) => {
      if (err) return res.status(400).send(err.message);
      res.send("Raw material added");
    }
  );
});

// ISSUE MATERIAL (AUTO STOCK DEDUCTION)
router.post("/issue-material", (req, res) => {
  const { RM_ID, Qty, Production_Order, Operator } = req.body;

  db.get(
    `SELECT Balance_Qty FROM RawMaterialMaster WHERE RM_ID = ?`,
    [RM_ID],
    (err, row) => {
      if (!row) return res.status(404).send("Material not found");
      if (row.Balance_Qty < Qty)
        return res.status(400).send("Insufficient stock");

      db.run(
        `UPDATE RawMaterialMaster 
         SET Balance_Qty = Balance_Qty - ? 
         WHERE RM_ID = ?`,
        [Qty, RM_ID]
      );

      db.run(
        `INSERT INTO InventoryTransactions 
         (RM_ID, Qty, Production_Order, Operator, DateTime)
         VALUES (?,?,?,?,datetime('now'))`,
        [RM_ID, Qty, Production_Order, Operator]
      );

      res.send("Material issued & stock updated");
    }
  );
});

// USE MOLD (CYCLE COUNT)
router.post("/use-mold", (req, res) => {
  const { Mold_ID } = req.body;

  db.run(
    `UPDATE MoldMaster 
     SET Current_Cycles = Current_Cycles + 1 
     WHERE Mold_ID = ?`,
    [Mold_ID],
    (err) => {
      if (err) return res.status(400).send(err.message);
      res.send("Mold cycle updated");
    }
  );
});

// FINISH PART + TRACEABILITY
router.post("/finish-part", (req, res) => {
  const { Serial_No, PO_Number, Mold_ID, RM_ID, Qty } = req.body;

  db.run(
    `INSERT INTO FinishedGoods 
     (Serial_No, PO_Number, Mold_ID, Status)
     VALUES (?,?,?,?)`,
    [Serial_No, PO_Number, Mold_ID, "OK"]
  );

  db.run(
    `INSERT INTO Traceability 
     (Serial_No, RM_ID, Qty, Mold_ID, DateTime)
     VALUES (?,?,?,?,datetime('now'))`,
    [Serial_No, RM_ID, Qty, Mold_ID]
  );

  res.send("Part completed & traceability saved");
});

// TRACEABILITY REPORT
router.get("/trace/:serial", (req, res) => {
  db.all(
    `SELECT * FROM Traceability WHERE Serial_No = ?`,
    [req.params.serial],
    (err, rows) => {
      if (err) return res.status(400).send(err.message);
      res.json(rows);
    }
  );
});

module.exports = router;

