const fs = require("fs");
const path = require("path");

const PLANET_DATA_PATH = path.resolve(__dirname, "../data/exoplanets.json");
const STARS_DATA_PATH = path.resolve(__dirname, "../data/stars.json");

function loadJson(filepath) {
  const raw = fs.readFileSync(filepath, "utf8");
  return JSON.parse(raw);
}

const getPlanetsData = () => {
  let planets = [];
  try {
    planets = loadJson(PLANET_DATA_PATH);
    // Normalize/flatten if your JSON nests host & planets array like your example:
    // We will produce a flattened list of planet entries each with host data copied in.
    const flattened = [];
    planets.forEach((host) => {
      const commonHost = {
        hostname: host.hostname,
        ra: host.ra,
        dec: host.dec,
        coords_pc: host.coords_pc,
        distance_pc: host.distance_pc,
        distance_ly: host.distance_ly,
      };
      if (Array.isArray(host.planets) && host.planets.length > 0) {
        host.planets.forEach((p) => {
          flattened.push({
            // Use pl_name as unique name key (as you said)
            pl_name: p.pl_name,
            hostname: commonHost.hostname,
            ra: commonHost.ra,
            dec: commonHost.dec,
            coords_pc: commonHost.coords_pc,
            distance_pc: commonHost.distance_pc,
            distance_ly: commonHost.distance_ly,
            disc_year: p.disc_year ?? null,
            disc_method: p.disc_method ?? null,
            pl_orbper: p.pl_orbper ?? null,
            // keep raw host object for later if needed
            _host_raw: commonHost,
          });
        });
      } else {
        // host has no planets array (defensive)
      }
    });
    planets = flattened;
    return planets;
  } catch (err) {
    console.error("Failed to load planet data:", err);
    return planets;
  }
};

function parseNumberParam(val, fallback = undefined) {
  if (val === undefined) return fallback;
  const n = Number(val);
  return Number.isFinite(n) ? n : fallback;
}

/** Utility: safe log10 */
function log10(x) {
  return Math.log(x) / Math.log(10);
}

/** Utility: compute euclidean distance in parsecs */
function distParsec(a, b) {
  const dx = a.x - b.x;
  const dy = a.y - b.y;
  const dz = a.z - b.z;
  return Math.sqrt(dx * dx + dy * dy + dz * dz);
}

const getExoPlanets = (req, res) => {
  try {
    let results = getPlanetsData();

    // ---- SEARCH (planet name OR host name, case-insensitive, partial) ----
    const search = (req.query.search || "").trim().toLowerCase();
    if (search.length > 0) {
      results = results.filter((p) => {
        const name = (p.pl_name || "").toLowerCase();
        const host = (p.hostname || "").toLowerCase();
        return name.includes(search) || host.includes(search);
      });
    }

    // ---- FILTER: distance (light years) ----
    const distanceMin = parseNumberParam(req.query.distance_min, -Infinity);
    const distanceMax = parseNumberParam(req.query.distance_max, Infinity);
    if (distanceMin !== -Infinity || distanceMax !== Infinity) {
      results = results.filter((p) => {
        const d = parseNumberParam(p.distance_ly, Infinity);
        return d >= distanceMin && d <= distanceMax;
      });
    }

    // ---- FILTER: discovery year ----
    const yearMin = parseNumberParam(req.query.year_min, -Infinity);
    const yearMax = parseNumberParam(req.query.year_max, Infinity);
    if (yearMin !== -Infinity || yearMax !== Infinity) {
      results = results.filter((p) => {
        const y = parseNumberParam(p.disc_year, null);
        if (y === null) return false; // exclude unknown years when filtering by range
        return y >= yearMin && y <= yearMax;
      });
    }

    // ---- SORT ----
    const sort = (req.query.sort || "").toLowerCase();
    if (sort === "closest") {
      results.sort((a, b) => {
        const da = parseNumberParam(a.distance_ly, Infinity);
        const db = parseNumberParam(b.distance_ly, Infinity);
        return da - db;
      });
    } else if (sort === "newest") {
      // newest discovery: descending disc_year
      results.sort((a, b) => {
        const ay = parseNumberParam(a.disc_year, -Infinity);
        const by = parseNumberParam(b.disc_year, -Infinity);
        return by - ay;
      });
    } else if (sort === "fastest") {
      // fastest orbit => smallest pl_orbper (ascending)
      results.sort((a, b) => {
        const ao = parseNumberParam(a.pl_orbper, Infinity);
        const bo = parseNumberParam(b.pl_orbper, Infinity);
        return ao - bo;
      });
    } else if (sort === "slowest") {
      // slowest orbit => largest pl_orbper (descending)
      results.sort((a, b) => {
        const ao = parseNumberParam(a.pl_orbper, -Infinity);
        const bo = parseNumberParam(b.pl_orbper, -Infinity);
        return bo - ao;
      });
    } else {
      // default sort: maybe by name for stable order
      results.sort((a, b) => {
        return (a.pl_name || "").localeCompare(b.pl_name || "");
      });
    }

    // ---- PAGINATION ----
    const page = Math.max(1, parseNumberParam(req.query.page, 1));
    const limit = Math.min(
      500,
      Math.max(1, parseNumberParam(req.query.limit, 20))
    ); // cap limit
    const total = results.length;
    const totalPages = Math.max(1, Math.ceil(total / limit));
    const start = (page - 1) * limit;
    const end = start + limit;
    const pageResults = results.slice(start, end);

    // ---- Map to lightweight response shape for dropdown ----
    const lightweight = pageResults.map((p) => ({
      pl_name: p.pl_name,
      hostname: p.hostname,
      disc_year: p.disc_year,
      distance_ly:
        p.distance_ly !== undefined ? Number(p.distance_ly).toFixed(2) : null,
      pl_orbper: p.pl_orbper ?? null,
      disc_method: p.disc_method ?? null,
    }));

    res.json({
      total,
      page,
      limit,
      totalPages,
      results: lightweight,
    });
  } catch (err) {
    console.error("Error in /api/exoplanets:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

const getStarsAroundExoPlanet = (req, res) => {
  console.log("received planet name", req.params.plName);
  const cache = new Map();
  const CACHE_TTL_MS = 60 * 1000; // 60s TTL (adjust as needed)
  try {
    const planets = getPlanetsData();
    const stars = loadJson(STARS_DATA_PATH);
    const rawName = decodeURIComponent(req.params.plName);
    const topN = Math.max(1, Number(req.query.topN || 3000));
    const magLimit =
      req.query.mag_limit !== undefined ? Number(req.query.mag_limit) : null;

    // Check cache
    const cacheKey = `${rawName}|topN=${topN}|mag=${magLimit ?? "none"}`;
    const cached = cache.get(cacheKey);
    if (cached && Date.now() - cached.ts < CACHE_TTL_MS) {
      return res.json({ planet: rawName, stars: cached.data });
    }

    // Find the planet
    const planet = planets.find((p) => p.pl_name === rawName);
    if (!planet) {
      return res.status(404).json({ error: `Planet "${rawName}" not found.` });
    }

    // planet coords
    const px = planet.coords_pc?.x;
    const py = planet.coords_pc?.y;
    const pz = planet.coords_pc?.z;
    if (![px, py, pz].every(Number.isFinite)) {
      return res
        .status(400)
        .json({ error: "Planet coords not valid (coords_pc.x/y/z required)." });
    }
    const planetXYZ = { x: px, y: py, z: pz };

    // We'll build an array of stars with computed relative coordinates and magnitudes
    const computed = [];

    for (let i = 0; i < stars.length; i++) {
      const s = stars[i];

      // star must have usable catalog distance (distance_pc) and catalog apparent mag (mag)
      const d_star_catalog = Number(s.distance_pc);
      const m_star_earth = Number(s.mag);

      // if star lacks valid distance or magnitude, skip it
      if (
        !Number.isFinite(d_star_catalog) ||
        d_star_catalog <= 0 ||
        !Number.isFinite(m_star_earth)
      ) {
        // skip problematic entries (your sample contains some negative distance placeholders)
        continue;
      }

      // Relative position (parsecs) of star relative to planet
      const relX = Number(s.x) - planetXYZ.x;
      const relY = Number(s.y) - planetXYZ.y;
      const relZ = Number(s.z) - planetXYZ.z;

      const d_planet = Math.sqrt(relX * relX + relY * relY + relZ * relZ); // in parsecs

      if (!Number.isFinite(d_planet) || d_planet <= 0) {
        continue; // skip degenerate cases
      }

      // Compute absolute magnitude M
      // M = m_earth - 5*log10(d_earth) + 5
      const M = m_star_earth - 5 * log10(d_star_catalog) + 5;

      // Apparent magnitude from planet:
      // m_planet = M + 5*log10(d_planet) - 5
      const m_planet = M + 5 * log10(d_planet) - 5;

      // Optionally skip extremely faint stars early (micro-optimization)
      if (magLimit !== null && m_planet > magLimit) continue;

      // push computed star
      computed.push({
        id: s.id ?? s.name ?? `star_${i}`,
        name: s.name ?? null,
        x: relX,
        y: relY,
        z: relZ,
        distance_pc_from_planet: Number(d_planet.toFixed(6)),
        mag: Number(m_planet.toFixed(3)),
        color: s.color ?? null,
        bv: s.bv ?? null,
        spectral_type: s.spectral_type ?? null,
        // keep a reference to original star distance/mag if needed
        catalog_distance_pc: Number(d_star_catalog),
        catalog_mag: Number(m_star_earth),
      });
    }

    // Sort by apparent magnitude ascending (brightest first; smaller = brighter)
    computed.sort((a, b) => a.mag - b.mag);

    // Take top N
    const resultStars = computed.slice(0, Math.min(topN, computed.length));

    // Cache and return
    cache.set(cacheKey, { ts: Date.now(), data: resultStars });

    return res.json({
      planet: rawName,
      planet_data: {
        disc_year: planet.disc_year,
        disc_method: planet.disc_method,
        pl_orbper: planet.pl_orbper,
        hostname: planet.hostname,
      },
      planet_coords_pc: planet.coords_pc,
      count_total_visible: computed.length,
      returned: resultStars.length,
      stars: resultStars,
    });
  } catch (err) {
    console.error("Error in /api/exosky/:plName", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = { getExoPlanets, getStarsAroundExoPlanet };
