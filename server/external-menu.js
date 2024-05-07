var express = require("express");
var router = express.Router();

router.get("/calender/:rKey/menu", function (req, res) {
  const result = {
    nodes: [
      {
        title: "مدیریت پیام ها",
        nodes: [
          { title: "لیست پیام ها", pid: "default" },
          { title: "مدیریت برچسب ها", pid: 13 },
        ],
      },
    ],
  };
  res.json(result);
});

router.get("/task/:rKey/menu", function (req, res) {
  const result = {
    nodes: [
      {
        title: "مدیریت تسک",
        nodes: [
          { title: "لیست پروژه ها", pid: 11 },
          { title: "مدیریت پروژه ها", pid: "default" },
        ],
      },
    ],
  };
  res.json(result);
});

module.exports = router;
