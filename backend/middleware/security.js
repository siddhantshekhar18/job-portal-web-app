function createRateLimiter({ windowMs, max, message }) {
  const requests = new Map();

  return (req, res, next) => {
    const now = Date.now();
    const key = req.ip || req.socket.remoteAddress || "unknown";
    const entry = requests.get(key);

    if (!entry || now >= entry.resetAt) {
      requests.set(key, { count: 1, resetAt: now + windowMs });
      return next();
    }

    entry.count += 1;
    if (entry.count > max) {
      res.set("Retry-After", Math.ceil((entry.resetAt - now) / 1000));
      return res.status(429).json({ success: false, message });
    }

    next();
  };
}

function securityHeaders(_req, res, next) {
  res.set({
    "X-Content-Type-Options": "nosniff",
    "X-Frame-Options": "DENY",
    "Referrer-Policy": "strict-origin-when-cross-origin",
    "Permissions-Policy": "camera=(), microphone=(), geolocation=()",
  });
  next();
}

function configureCors(allowedOrigins) {
  return (req, res, next) => {
    const origin = req.headers.origin;
    if (!origin) return next();

    // Same-origin requests do not need CORS headers and must remain allowed
    // when the frontend and API are served together.
    const requestOrigin = `${req.protocol}://${req.get("host")}`;
    if (origin === requestOrigin || allowedOrigins.length === 0) return next();

    if (!allowedOrigins.includes(origin)) {
      return res.status(403).json({ success: false, message: "Origin is not allowed" });
    }

    res.set({
      "Access-Control-Allow-Origin": origin,
      Vary: "Origin",
      "Access-Control-Allow-Headers": "Authorization, Content-Type",
      "Access-Control-Allow-Methods": "GET, POST, PUT, PATCH, DELETE, OPTIONS",
    });

    if (req.method === "OPTIONS") return res.sendStatus(204);
    next();
  };
}

module.exports = { createRateLimiter, securityHeaders, configureCors };
