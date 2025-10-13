const express = require("express");
const next = require("next");

const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = express();

//   // Example API route in Express
//   server.get("/api/custom", (req, res) => {
//     res.json({ message: "Hello from Express API!" });
//   });

//   // Custom route (Example: /about)
//   server.get("/about", (req, res) => {
//     return app.render(req, res, "/about");
//   });

  // Handle all other Next.js routes
  server.all(/(.*)/, (req, res) => {
    return handle(req, res);
  });

  const PORT = process.env.PORT || 4000;
  server.listen(PORT, () => {
    console.log(`> Ready on http://localhost:${PORT}`);
  });
});
