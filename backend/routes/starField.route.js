const { Router } = require("express");
const {
  getExoPlanets,
  getStarsAroundExoPlanet,
} = require("../controllers/starField.controller");
const authMiddleware = require("../middleware/authMiddleware");
const router = Router();

// router.get("/exoplanets", authMiddleware, getExoPlanets);
router.get("/exoplanets", getExoPlanets);
router.get("/exosky/:plName", authMiddleware, getStarsAroundExoPlanet);
// router.get("/exosky/:plName", getStarsAroundExoPlanet);

module.exports = router;
