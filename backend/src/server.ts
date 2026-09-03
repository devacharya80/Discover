import express from "express";
import cookieParser from "cookie-parser";

import healthRouter from "./routes/health.route.js";
import authRouter from "./routes/auth.route.js";
import meRouter from "./routes/me.route.js";
import userRouter from "./routes/user.route.js";
import companyRouter from "./routes/company.route.js"

const app = express();

const PORT = 5000;

app.use(express.json());
app.use(cookieParser());

app.use("/api", healthRouter);
app.use("/api/auth", authRouter);
app.use("/api/auth", meRouter);
app.use("/api/user", userRouter);
app.use("/api/company",companyRouter)

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});