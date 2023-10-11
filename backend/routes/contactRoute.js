const protect = require("../middleWare/authMiddleware");
const { contactUs } = require("../controllers/contactController");

const express = require("express");
const router = express.Router();

router.post("/", protect, contactUs);
module.exports = router;
