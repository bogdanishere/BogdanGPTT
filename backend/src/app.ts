import express from "express";
import morgan from "morgan";
import cors from "cors";
import queryDocuments from "./routes/queryDocuments";
import createHttpError from "http-errors";
import errorHandler from "./middlewares/errorHandler";

const app = express();
app.use(express.json());
app.use(morgan("dev"));

app.use(
  cors({
    origin: "http://localhost:3000",
  })
);

app.use("/ask", queryDocuments);

app.use((req, res, next) => next(createHttpError(404, "Endpoint not found")));

app.use(errorHandler);

export default app;
