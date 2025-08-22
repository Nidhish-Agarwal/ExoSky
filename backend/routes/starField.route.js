const { Router } = require("express");
const {
  getExoPlanets,
  getStarsAroundExoPlanet,
} = require("../controllers/starField.controller");
const authMiddleware = require("../middleware/authMiddleware");
const router = Router();

router.get("/exoplanets", authMiddleware, getExoPlanets);
router.get("/exosky/:plName", authMiddleware, getStarsAroundExoPlanet);

module.exports = router;
