const express = require("express");
const blogRoutes = require("./blog");
const hariRoutes = require("./hari");

const router = express.Router();

router.use("/blog", blogRoutes);
router.use("/hari", hariRoutes);

module.exports = router;
