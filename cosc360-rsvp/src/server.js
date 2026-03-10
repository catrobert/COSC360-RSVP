import express from "express";
import loginRouter from "./components/login/processLogin.js";
import cors from "cors";

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());
app.use(loginRouter);

app.get("/", (req, res) => {
  res.send("Hello World!");
});


app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});