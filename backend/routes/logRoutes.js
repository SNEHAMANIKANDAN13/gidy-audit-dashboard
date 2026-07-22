const express = require("express");
const router = express.Router();
const { uploadLogs, getLogs } = require("../controllers/logController");

router.post("/upload", uploadLogs);
router.get("/", getLogs);

module.exports = router;