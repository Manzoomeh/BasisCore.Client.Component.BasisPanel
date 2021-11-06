var fs = require("fs");
const path = require("path");
var express = require("express");
var router = express.Router();


router.get("/:rKey/widget/:widgetId", function (req, res) {
  const widgetList = fs.readFileSync(
    path.join(__dirname, "external", req.params.widgetId),
    {
      encoding: "utf8",
    }
  );
  res.send(widgetList);
});
module.exports = router;
