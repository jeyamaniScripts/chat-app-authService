const express = require("express");
const dotenv = require("dotenv");

const cors = require("cors");
const morgan = require("morgan");
const userRoutes = require("./routes/user.routes.js");
const { notFound, errorHandler } = require("./middleware/errorMiddleware.js");
const startGrpcServer = require("./grpc/server.js");

dotenv.config();

const app = express();

// Middlewares
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://chat-app-practice-frontend.vercel.app",
    ],
    credentials: true,
  }),
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

app.use("/api/user", userRoutes);

app.use(notFound);
app.use(errorHandler);

startGrpcServer();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
