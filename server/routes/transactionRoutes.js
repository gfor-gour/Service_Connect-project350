const express = require("express");
const router = express.Router();
const {
  initTransaction,
  successTransaction,
  getTransaction,
  failTransaction
} = require("../controllers/transactionController");

router.post("/sslcommerz/init", initTransaction);
router.post("/sslcommerz/success/:tran_id", successTransaction);
router.get("/transaction/:tran_id", getTransaction);
router.post("/sslcommerz/fail/:tran_id", failTransaction);

module.exports = router;
