const express = require("express");
const router = express.Router();
const entryController = require("../controllers/entryController")

router.get("/", entryController.about);
router.get("/torpil-arsivi", entryController.entryArchive);
router.get("/torpil-ekle", entryController.addEntry);
router.get("/ayin-oylamasi", entryController.voteEntries);
router.get("/ayin-en-iyisi", entryController.bestEntry);
router.get("/en-guncel", entryController.mostRecentEntry);
router.get("/rastgele", entryController.randomEntry);

router.post('/torpil-ekle', entryController.addEntryPost);
  

module.exports = router;