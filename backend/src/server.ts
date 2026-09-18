import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import healthRouter from "./routes/health.route.js";
import authRouter from "./routes/auth.route.js";
import meRouter from "./routes/me.route.js";
import userRouter from "./routes/user.route.js";
import companyRouter from "./routes/company.route.js";
import jobsRouter from "./routes/jobs.route.js";
import applicationRouter from "./routes/application.route.js";
import savedJobRouter from "./routes/saved-job.route.js";
import claimRouter from "./routes/claim.route.js";
import memberRouter from "./routes/member.route.js";

const app = express();
const PORT = Number(process.env.PORT ?? 5000);
const frontendOrigin = process.env.FRONTEND_URL ?? "http://localhost:5173";

app.disable("x-powered-by");
app.use(cors({
  origin: frontendOrigin,
  credentials: true,
  methods: ["GET","POST","PATCH","DELETE","PUT","OPTIONS"],
  allowedHeaders: ["Content-Type","Authorization"],
}));
app.use(express.json({ limit: "1mb" }));
app.use(cookieParser());

app.get("/api/health", (_req, res) => res.json({ status: "ok", service: "discover-api" }));
app.use("/api/auth", authRouter);
app.use("/api/auth", meRouter);
app.use("/api/user", userRouter);
app.use("/api/company", companyRouter);
app.use("/api/jobs", jobsRouter);
app.use("/api/applications", applicationRouter);
app.use("/api/saved-jobs", savedJobRouter);
app.use("/api/claims", claimRouter);
app.use("/api/members", memberRouter);

app.use((_req, res) => res.status(404).json({ message: "Route not found" }));
app.use((err: unknown, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error(err);
  return res.status(500).json({ message: "Internal server error" });
});

const server = app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));

const shutdown = async () => {
  server.close(() => process.exit(0));
};
process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);

export default app;
