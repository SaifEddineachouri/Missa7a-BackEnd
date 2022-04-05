const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const colors = require("colors");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const errorHandler = require("./middleware/error");
const connectDB = require("./config/db");
// Load env vars
dotenv.config({ path: "./config/config.env" });

// Connect to Database
connectDB();

// Route files
const patients = require("./routes/patients");
const folders = require("./routes/folders");
const appointment = require("./routes/appointments");
const auth = require("./routes/auth");
const users = require("./routes/users");
const app = express();

// Body parser
app.use(express.json());
app.use("/public/images", express.static("./public/images"));
app.use("/public/documents", express.static("./public/documents"));

const corsOptions = {
  origin: "http://localhost:4200",
  preflightContinue: false,
  optionSuccessStatus: 200,
  optionsSuccessStatus: 204,
  credentials: true,
};

// enable cors
app.use(cors(corsOptions));

// Cookie parser
app.use(cookieParser());

// Dev logging middleware
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Mount routers
app.use("/api/v1/patients", patients);
app.use("/api/v1/dossiers", folders);
app.use("/api/v1/appointments", appointment);
app.use("/api/v1/auth", auth);
app.use("/api/v1/users", users);

app.use(errorHandler);

const PORT = process.env.PORT || 5000;

// we put it on a const server to close the server when we got error ==> unhandled promise rejections
const server = app.listen(
  PORT,
  console.log(
    `Server Running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold
  )
);

// Handle unhandled promise rejections
process.on("unhandledRejection", (err, promise) => {
  console.log(`Error : ${err.message}`.red);
  // Close server and exit process
  server.close(() => process.exit(1));
});
