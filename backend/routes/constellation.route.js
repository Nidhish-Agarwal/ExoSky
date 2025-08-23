const { Router } = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const router = Router();

const {
  storeConstellation,
  getAllConstellations,
} = require("../controllers/constellation.controller");

router.post("/", authMiddleware, storeConstellation);
router.get("/", authMiddleware, getAllConstellations);

module.exports = router;
