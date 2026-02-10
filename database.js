const sqlite3 = require("sqlite3").verbose();

// Create SQLite database file
const db = new sqlite3.Database("./mes.db");

// RAW MATERIAL MASTER
db.run(`
CREATE TABLE IF NOT EXISTS RawMaterialMaster (
  RM_ID TEXT PRIMARY KEY,
  Material_Type TEXT,
  Process TEXT,
  Batch_No TEXT,
  Balance_Qty REAL,
  Expiry_Date TEXT,
  Status TEXT
)`);

// MATERIAL ISSUE LOG
db.run(`
CREATE TABLE IF NOT EXISTS InventoryTransactions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  RM_ID TEXT,
  Qty REAL,
  Production_Order TEXT,
  Operator TEXT,
  DateTime TEXT
)`);

// MOLD MASTER
db.run(`
CREATE TABLE IF NOT EXISTS MoldMaster (
  Mold_ID TEXT PRIMARY KEY,
  Max_Cycles INTEGER,
  Current_Cycles INTEGER,
  Status TEXT
)`);

// PRODUCTION ORDERS
db.run(`
CREATE TABLE IF NOT EXISTS ProductionOrders (
  PO_Number TEXT PRIMARY KEY,
  Product_Code TEXT,
  Status TEXT
)`);

// FINISHED GOODS
db.run(`
CREATE TABLE IF NOT EXISTS FinishedGoods (
  Serial_No TEXT PRIMARY KEY,
  PO_Number TEXT,
  Mold_ID TEXT,
  Status TEXT
)`);

// TRACEABILITY
db.run(`
CREATE TABLE IF NOT EXISTS Traceability (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  Serial_No TEXT,
  RM_ID TEXT,
  Qty REAL,
  Mold_ID TEXT,
  DateTime TEXT
)`);

module.exports = db;

