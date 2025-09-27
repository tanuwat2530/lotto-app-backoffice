// server.js

const express = require("express");
const next = require("next");

const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = express();
  
  // Apply necessary middleware
  server.use(express.json());
  server.use(express.urlencoded({ extended: true }));

  // Uncomment and use your custom Express routes here:
  
  // Example API route in Express
  // server.get("/api/custom", (req, res) => {
  //   res.json({ message: "Hello from Express API!" });
  // });

  // Custom route (Example: /about)
  // server.get("/about", (req, res) => {
  //   // Use app.render() to serve a Next.js page explicitly
  //   return app.render(req, res, "/about"); 
  // });


  // -----------------------------------------------------------------
  // FIX: Replace server.all("*", ...) with the robust catch-all pattern.
  // -----------------------------------------------------------------
  
  // This line must be the LAST route defined. 
  // It uses a regular expression to match ALL paths, which avoids the
  // "Missing parameter name" error and forwards the request to Next.js.
  server.all(/(.*)/, (req, res) => {
    return handle(req, res);
  });
  
  // -----------------------------------------------------------------


  const PORT = process.env.PORT || 4000;
  server.listen(PORT, (err) => {
    if (err) throw err; // Ensure the server starts successfully
    console.log(`> Ready on http://localhost:${PORT}`);
  });
})
.catch((ex) => {
    console.error('Error starting server:', ex.stack);
    process.exit(1);
});