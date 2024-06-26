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
router.get("/task/:rKey/page/:pageId", function (req, res) {
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
});
router.get("/task/:rKey/widget/:widgetId", function (req, res) {
  const widgetList = fs.readFileSync(
    path.join(__dirname, "pages", req.params.widgetId),
    {
      encoding: "utf8",
    }
  );
  res.send(widgetList);
});
router.get("/task/:rKey/errorMessages", function (req, res) {
  const errors = {
    v: "1.4",
    messages: [
      {
        id: 7.0,
        messageType: 3, // 3 : info

        culture: [
          {
            lid: 1.0,
            message: "اطلاعات",
          },
          {
            lid: 2.0,
            message: "info message",
          },
        ],
      },
    ],
  };
  res.json(errors);
});
module.exports = router;
