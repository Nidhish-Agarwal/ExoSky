const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const connectDatabase = require("./config/database.js");
const authRoutes = require("./routes/authRoutes");
const visualizationRouter = require("./routes/starField.route.js");
const constellationRouter = require("./routes/constellation.route.js");

app.use(express.json());
app.use(cookieParser());
connectDatabase();

const cors = require("cors");
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  })
);

app.use("/auth", authRoutes);
app.use("/visualization", visualizationRouter);
app.use("/constellation", constellationRouter);

const exoplanetRoutes = require("./routes/geminiRoutes.js");
app.use("/exoplanets", exoplanetRoutes);
const onboardingRoutes = require("./routes/onboardingRoutes");
app.use("/onboarding", onboardingRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;
