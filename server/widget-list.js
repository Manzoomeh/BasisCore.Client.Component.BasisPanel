const express = require("express");
const router = express.Router();
router.use(express.json());

const widgets = [
  {
    id: "userWidget1.html",
    title: "ویجت داشبورد",
    name: "userWidget1",
    icon :"/asset/images/reminder_1.png"
  },
  {
    id: "external-file.html",
    title: "اکسترنال ویجت",
    name: "externalFile",
    container: "widget",
    icon :"/asset/images/reminders_1.png"
  },
];

router.get("/:rkey/:pageId", function (req, res) {
  res.json(widgets);
});

router.post("/:rkey/:pageId", function (req, res) {
  // console.log(req.body);
  res.json(true);
});
module.exports = router;
