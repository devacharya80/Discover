import express from "express";
const app = express();
import prisma from "./lib/prisma.js";
import route from "./routes/health.route.js";

const PORT = 5000;

app.use(express.json());

app.use("/api",route)

app.use("/", async (req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    console.log("Database connected");
} catch (error) {
    console.error("Database connection failed", error);
}
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
