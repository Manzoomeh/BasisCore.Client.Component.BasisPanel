const express = require("express");
const router = express.Router();
router.use(express.json());

const widgets = [
  {
    id: "userWidget1.html",
    title: "ویجت داشبورد",
    name: "userWidget1",
    w: 12,
    h: 4,
    icon: "asset/images/reminder_1.png",
  },
  {
    id: "external-file.html",
    title: "اکسترنال ویجت",
    name: "externalFile",
    w: 6,
    h: 4,
    container: "widget",
    icon: "asset/images/reminders_1.png",
  },
];

router.get("/:rkey/:pageId", function (req, res) {
  res.json(widgets);
});

router.post("/:rkey/:pageId", function (req, res) {
  // console.log(req.body);
  res.json(true);
});
router.post("/saveWidgets/:rkey/:pageId", function (req, res) {
  // console.log(req.body);
  res.json({ errorid: 3, message: "successful" });
});
module.exports = router;
