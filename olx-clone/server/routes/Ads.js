const adRoutes = require("express").Router();

const AdController = require("../controllers/Ads");
const multer = require("multer");
const adController = new AdController();

// const storage = multer.diskStorage({
//   destination: "./uploads", // Specify the upload directory
//   filename: (req, file, cb) => {
//     cb(null, file.originalname); // Use the original filename
//   },
// });

const storage = multer.memoryStorage(); // Use memory storage for simplicity
const upload = multer({ storage });

adRoutes.post(
  "/create-ad",
  upload.array("images[]", 10),
  adController.createAd
);
adRoutes.get("/fetch-all-ads", adController.fetchAllAds);
adRoutes.get("/fetch-ad/:bloguuid", adController.fetchOneAd);
adRoutes.get("/delete-ad/:bloguuid", adController.deleteAd);

// adRoutes.get("/", (req, res) => res.send("I am working"));

module.exports = adRoutes;
