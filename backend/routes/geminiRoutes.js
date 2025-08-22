const express = require("express");
const router = express.Router();
const { getExoplanetNarration } = require("../controllers/exoplanetController");

router.post("/generate", getExoplanetNarration);

module.exports = router;
