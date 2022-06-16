const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const colors = require("colors");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const mongoSanitize = require("express-mongo-sanitize");
const helmet = require("helmet");
const xss = require("xss-clean");
const rateLimit = require("express-rate-limit");
const hpp = require("hpp");
const errorHandler = require("./middleware/error");
const connectDB = require("./config/db");
const scheduler = require("./scheduler");
// Load env vars
dotenv.config({ path: "./config/config.env" });

// Connect to Database
connectDB();

// Route files
const patients = require("./routes/patients");
const folders = require("./routes/folders");
const appointments = require("./routes/appointments");
const appointmentRequests = require("./routes/appointmentsRequests");
const consultations = require("./routes/consultations");
const acts = require("./routes/acts");
const financialAccounts = require("./routes/financialAccounts");
const stocks = require("./routes/stocks");
const categories = require("./routes/stockCategories");
const products = require("./routes/products");
const prescriptions = require("./routes/prescriptions");
const medications = require("./routes/medications");
const certifications = require("./routes/certifications");

const users = require("./routes/users");
const auth = require("./routes/auth");
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

// Sanitize Data
app.use(mongoSanitize());

// Set security headers
app.use(helmet());

// Prevent XSS Scripting
app.use(xss());

// Rate Limiting
const limiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 mins
  max: 100,
});
app.use(limiter);

// Prevent http param pollution
app.use(hpp());

// Mount routers
app.use("/api/v1/patients", patients);
app.use("/api/v1/dossiers", folders);
app.use("/api/v1/appointments", appointments);
app.use("/api/v1/appointment/request", appointmentRequests);
app.use("/api/v1/consultations", consultations);
app.use("/api/v1/acts", acts);
app.use("/api/v1/accounts", financialAccounts);
app.use("/api/v1/stocks", stocks);
app.use("/api/v1/categories", categories);
app.use("/api/v1/products", products);
app.use("/api/v1/prescriptions", prescriptions);
app.use("/api/v1/medications", medications);
app.use("/api/v1/certifications", certifications);
app.use("/api/v1/users", users);
app.use("/api/v1/auth", auth);

app.use(errorHandler);

app.get("/", (req, res) => {
  res.sendFile("index.html", { root: "public" });
});

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

scheduler.start();
