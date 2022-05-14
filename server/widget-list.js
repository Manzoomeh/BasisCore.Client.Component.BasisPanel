const express = require("express");
const router = express.Router();
router.use(express.json());

const widgets = [
  {
    id: "userWidget1.html",
    title: "ویجت داشبورد",
    name: "userWidget1",
  },
  {
    id: "external-file.html",
    title: "اکسترنال ویجت",
    name: "externalFile",
    container: "widget",
  },
];

router.get("/:rkey/:pageId", function (req, res) {
  res.json(widgets);
});

router.post("/:rkey/:pageId", function (req, res) {
  console.log(req.body);
  res.json(true);
});
module.exports = router;
