var fs = require("fs");
const path = require("path");
var express = require("express");
var router = express.Router();


router.get("/calender/:rKey/page/:pageId", function (req, res) {
 const widgetList = fs.readFileSync(
  path.join(__dirname, "pages/widget-list.json"),
  {
    encoding: "utf8",
  }
);
  res.json(Reflect.get(JSON.parse(widgetList), req.params.pageId));
});

router.get("/calender/:rKey/widget/:widgetId", function (req, res) {
  const widgetList = fs.readFileSync(
    path.join(__dirname, "pages", req.params.widgetId),
    {
      encoding: "utf8",
    }
  );
  res.send(widgetList);
})
module.exports = router;
