import express from "express";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

type Event = { id: number; title: string; description?: string };
let events: Event[] = [];
let nextId = 1;

app.post("/login", (req, res) => {
  const { email, password } = req.body || {};
  if (email === "qa@empresa.com" && password === "123456") {
    return res.json({ token: "ok" });
  }
  return res.status(401).json({ error: "invalid credentials" });
});

app.get("/events", (req, res) => {
  res.json(events);
});

app.post("/events", (req, res) => {
  const { title, description } = req.body || {};
  if (!title) return res.status(400).json({ error: "title required" });
  const ev: Event = { id: nextId++, title, description };
  events.push(ev);
  res.status(201).json(ev);
});

app.post("/test/reset", (req, res) => {
  events = [];
  nextId = 1;
  res.sendStatus(200);
});

const port = Number(process.env.PORT || 3001);
app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`API listening on ${port}`);
});
