const jsonServer = require("json-server");
const fs = require("fs");
const path = require("path");

const server = jsonServer.create();
const router = jsonServer.router(path.join(__dirname, "db.json"));
const middlewares = jsonServer.defaults();

server.use(middlewares);
server.use(jsonServer.bodyParser);

// Custom login endpoint
server.post("/auth", (req, res) => {
  const db = JSON.parse(
    fs.readFileSync(path.join(__dirname, "db.json"), "utf8")
  );
  const { username, password, email } = req.body;

  // Check for web login (username + password)
  if (username && password) {
    const user = db.auth.find(
      (u) => u.username === username && u.password === password
    );
    if (user) {
      return res.status(200).json({ token: user.token });
    }
    return res.status(400).json({ message: "Invalid credentials" });
  }

  // Check for native login (email + password)
  if (email && password) {
    const user = db.auth.find(
      (u) => u.email === email && u.password === password
    );
    if (user) {
      return res.status(200).json({ token: user.token });
    }
    return res.status(400).json({ message: "Invalid credentials" });
  }

  res.status(400).json({ message: "Missing credentials" });
});

server.use(router);

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Mock API server running at http://localhost:${PORT}`);
  console.log("Web login: username=kminchelle, password=0lelplR");
  console.log("Native login: email=eve.holt@reqres.in, password=cityslicka");
});
