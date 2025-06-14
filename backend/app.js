import fs from "node:fs/promises";
import bodyParser from "body-parser";
import express from "express";

const app = express();

app.use(express.static("images"));
app.use(bodyParser.json());

// CORS middleware
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") {
    return res.sendStatus(204);
  }
  next();
});

// Get smartphones
app.get("/smartphones", async (req, res) => {
  try {
    const fileContent = await fs.readFile("./data/smartphones.json", "utf-8");
    const smartphones = JSON.parse(fileContent);
    res.status(200).json({ smartphones });
  } catch (err) {
    res.status(500).json({ error: "Failed to load smartphones" });
  }
});

// Login user
app.post("/login", async (req, res) => {
  try {
    const { login, password } = req.body;
    const fileContent = await fs.readFile("./data/users.json", "utf-8");
    const users = JSON.parse(fileContent);
    const user = users.find(u => u.login === login && u.password === password);
    res.status(200).json({ success: user });
  } catch (err) {
    res.status(500).json({ success: false, error: "Server error" });
  }
});

// Add new user
app.post("/users", async (req, res) => {
  try {
    const { login, password } = req.body;
    if (!login || !password) {
      return res.status(400).json({ success: false, error: "Login and password required" });
    }
    const fileContent = await fs.readFile("./data/users.json", "utf-8");
    const users = JSON.parse(fileContent);
    if (users.some(u => u.login === login)) {
      return res.status(409).json({ success: false, error: "User already exists" });
    }
    const id = users[ users.length - 1 ]?.id + 1 || 1; // Generate new ID
    const newUser = { id, login, password, basket: [] };
    users.push(newUser);
    await fs.writeFile("./data/users.json", JSON.stringify(users, null, 2));
    res.status(201).json({ success: newUser });
  } catch (err) {
    res.status(500).json({ success: false, error: "Server error" });
  }
});

// Add smartphone to basket
app.post("/basket", async (req, res) => {
  try {
    const { userId, smartphoneId } = req.body;
    if (!userId || !smartphoneId) {
      return res.status(400).json({ success: false, error: "User ID and smartphone ID required" });
    }
    const fileContent = await fs.readFile("./data/users.json", "utf-8");
    const users = JSON.parse(fileContent);
    const user = users.find(u => u.id === userId);
    if (!user) {
      return res.status(404).json({ success: false, error: "User not found" });
    }
    if (user.basket.includes(smartphoneId)) {
      return res.status(409).json({ success: false, error: "Smartphone already in basket" });
    }
    user.basket.push(smartphoneId);
    await fs.writeFile("./data/users.json", JSON.stringify(users, null, 2));
    res.status(200).json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, error: "Server error" });
  }
});

// Remove smartphone from basket  
app.delete("/basket", async (req, res) => {
  try {
    const { userId, smartphoneIds } = req.body;
    if (!userId || !Array.isArray(smartphoneIds) || smartphoneIds.length === 0) {
      return res.status(400).json({ success: false, error: "User ID and array of smartphone IDs required" });
    }
    const fileContent = await fs.readFile("./data/users.json", "utf-8");
    const users = JSON.parse(fileContent);
    const user = users.find(u => u.id === userId);
    if (!user) {
      return res.status(404).json({ success: false, error: "User not found" });
    }
    // Remove all specified smartphoneIds from basket
    user.basket = user.basket.filter(id => !smartphoneIds.includes(id));
    await fs.writeFile("./data/users.json", JSON.stringify(users, null, 2));
    res.status(200).json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, error: "Server error" });
  }
});

// 404 handler
app.use((req, res, next) => {
  if (req.method === "OPTIONS") return next();
  res.status(404).json({ message: "404 - Not Found" });
});

app.listen(3000);
