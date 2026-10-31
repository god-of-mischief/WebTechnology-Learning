const http = require("http");
const fs = require("fs");
const path = require("path");

const PORT = 3001;
const ROOT = __dirname;
const DATA_FILE = path.join(ROOT, "cars.json");
const INDEX_FILE = path.join(ROOT, "index.html");

function readCars() {
  try { return JSON.parse(fs.readFileSync(DATA_FILE, "utf8")); }
  catch (err) { console.error("Could not read cars.json:", err); return []; }
}

function writeCars(cars) {
  const temp = DATA_FILE + ".tmp";
  fs.writeFileSync(temp, JSON.stringify(cars, null, 2), "utf8");
  fs.renameSync(temp, DATA_FILE);
}

function send(res, status, body, type = "application/json; charset=utf-8") {
  res.writeHead(status, { "Content-Type": type, "Cache-Control": "no-store" });
  res.end(type.startsWith("application/json") ? JSON.stringify(body) : body);
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    let body = "";
    req.on("data", chunk => { body += chunk; if (body.length > 5 * 1024 * 1024) req.destroy(); });
    req.on("end", () => { try { resolve(JSON.parse(body || "null")); } catch (e) { reject(e); } });
    req.on("error", reject);
  });
}

const server = http.createServer(async (req, res) => {
  try {
    if (req.method === "GET" && req.url === "/api/cars") {
      return send(res, 200, readCars());
    }

    if (req.method === "PUT" && req.url === "/api/cars") {
      const cars = await readBody(req);
      if (!Array.isArray(cars)) return send(res, 400, { error: "Expected an array of cars." });
      writeCars(cars);
      return send(res, 200, { ok: true, cars });
    }

    if (req.method === "POST" && req.url === "/api/cars/import") {
      const cars = await readBody(req);
      if (!Array.isArray(cars)) return send(res, 400, { error: "Expected an array of cars." });
      writeCars(cars);
      return send(res, 200, { ok: true, cars });
    }

    if (req.method === "GET" && req.url === "/") {
      const html = fs.readFileSync(INDEX_FILE, "utf8");
      return send(res, 200, html, "text/html; charset=utf-8");
    }

    if (req.method === "GET" && req.url === "/index.html") {
      const html = fs.readFileSync(INDEX_FILE, "utf8");
      return send(res, 200, html, "text/html; charset=utf-8");
    }

    send(res, 404, { error: "Not found" });
  } catch (err) {
    console.error(err);
    send(res, 500, { error: "Server error", detail: err.message });
  }
});

server.listen(PORT, () => {
  console.log(`PIT WALL running at http://localhost:${PORT}`);
  console.log(`Car data is stored in ${DATA_FILE}`);
});
