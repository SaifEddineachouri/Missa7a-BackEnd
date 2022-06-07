const fs = require("fs");
const mongoose = require("mongoose");
const colors = require("colors");
const dotenv = require("dotenv");

// Load env vars
dotenv.config({ path: "./config/config.env" });

// Load models
const Patient = require("./models/Patient");
const Folder = require("./models/Folder");

// Connect to DB
mongoose.connect(process.env.MONGO_URI);

// Read JSON files
const patients = JSON.parse(
  fs.readFileSync(`${__dirname}/_data/patients.json`, "utf-8")
);

// Read JSON files
const dossiers = JSON.parse(
  fs.readFileSync(`${__dirname}/_data/Folders.json`, "utf-8")
);

// Import into DB
const importData = async () => {
  try {
    await Patient.create(patients);
    await Folder.create(dossiers);
    console.log("Data Imported ...".green.inverse);
    process.exit();
  } catch (error) {
    console.log(error);
  }
};

// Delete data from DB
const deleteData = async () => {
  try {
    await Patient.deleteMany();
    await Folder.deleteMany();
    console.log("Data Deleted ...".red.inverse);
    process.exit();
  } catch (error) {
    console.log(error);
  }
};

if (process.argv[2] === "-i") {
  importData();
} else if (process.argv[2] === "-d") {
  deleteData();
}
