const express = require("express");
const multer = require("multer");
const { protect, authorize } = require("../middleware/auth");
const {
  getDossiers,
  getArchivedDossiers,
  getDossier,
  addDossier,
  updateDossier,
  archiveDossier,
  restoreDossier,
} = require("../controllers/folders");

const router = express.Router({ mergeParams: true });

// Include other resource routers
const consultationRouter = require("./consultations");

// Re-route into other resource routers
router.use("/:dossierId/consultations", consultationRouter);

// Files Upload
const MIME_TYPE_MAP = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/jpg": "jpg",
  "application/pdf": "pdf",
  "application/msword": "doc",
};

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    const isValid = MIME_TYPE_MAP[file.mimetype];
    let error = new Error("Invalid Mime Type");

    if (isValid) {
      error = null;
    }
    callback(error, "public/documents");
  },
  filename: (req, file, callback) => {
    const name = file.originalname.toLowerCase().split(" ").join("-");
    const ext = MIME_TYPE_MAP[file.mimetype];
    const filename = file.originalname
      .split("/")
      .slice(-1)
      .join()
      .split(".")
      .shift();
    callback(null, filename + Date.now() + "." + ext);
  },
});

// Routes

router.route("/archived").get(getArchivedDossiers);

router
  .route("/")
  .get(protect, authorize("secretary", "admin"), getDossiers)
  .post(
    protect,
    authorize("secretary", "admin"),
    multer({ storage: storage }).array("files", 3),
    addDossier
  );
router
  .route("/:id")
  .get(getDossier)
  .put(protect, authorize("admin"), updateDossier)
  .put(protect, authorize("admin"), archiveDossier);

router.route("/archive/:id").put(protect, authorize("admin"), archiveDossier);
router.route("/:id/restore").put(protect, authorize("admin"), restoreDossier);

module.exports = router;
