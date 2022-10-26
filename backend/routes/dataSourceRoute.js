const express = require("express");
const router = express.Router();
const {
  getkoelbay,
  getBikiniBeach,
} = require("../controllers/dataSourceController");

// get koel spot
router.get("/koelbay", getkoelbay);

// get bikini beach spot

router.get("/bikinibeach", getBikiniBeach);

module.exports = router;
