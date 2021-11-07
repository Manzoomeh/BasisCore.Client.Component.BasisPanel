var fs = require("fs");
const path = require("path");
var express = require("express");
var router = express.Router();

// // middleware that is specific to this router
// router.use(function timeLog (req, res, next) {
//   console.log('Time: ', Date.now())
//   next()
// })

router.get("/:rKey/profile", function (req, res) {
  //console.log("profile", req.params);
  const result = [
    { prpid: 1, question: "نام كاربر", answer: "مریم" },
    { prpid: 2, question: "نام خانوادگي", answer: "جعفرزاده" },
    { prpid: 3, question: "آدرس الكترونيكي", answer: "kmg.d110@gmail.com" },
    { prpid: 4, question: "تلفن", answer: "12345678" },
    { prpid: 5, question: "موبایل", answer: "09123991046" },
    { prpid: 6, question: "آدرس", answer: "تهران - صادقیه" },
    { prpid: 7, question: "جنسيت", answer: "666" },
    { prpid: 8, question: "تاريخ تولد", answer: "1366" },
    { prpid: 9, question: "كد پستي", answer: "544123456" },
    { prpid: 10, question: "فکس", answer: "" },
    { prpid: 94, question: "عکس کوچک", answer: "ava600000000001" },
    { prpid: 95, question: "زبان", answer: "" },
    { prpid: 96, question: "واحد پول", answer: "" },
  ];
  res.json(result);
});

router.get("/:rKey/users/:file", function (req, res) {
  const type = "image/png";
  const s = fs.createReadStream(path.join(__dirname, `${req.params.file}.png`));
  s.on("open", function () {
    res.set("Content-Type", type);
    s.pipe(res);
  });
  s.on("error", function () {
    res.set("Content-Type", "text/plain");
    res.status(404).end("Not found");
  });
});

router.get("/:rKey/menu", function (req, res) {
  //console.log("menu", req.params);
  const result = {
    nodes: [
      {
        title: "اطلاعات کاربری",
        pid: "userInfo",
      },
      {
        title: "مدیریت فایل ها",
        nodes: [
          { title: "فایل های من", pid: 4 },
          { title: "اشتراک با من", pid: 5 },
        ],
      },
      { title: "تقویم", pid: 6 },
      {
        mid: 2,
        title: "Ticketing",
        multi: true,
        url: "/server/external/calender",
      },
      {
        mid: 4,
        title: "TaskManager",
        multi: false,
        url: "/server/external/task",
      },
    ],
  };
  res.json(result);
});

router.get("/:rKey/page/:pageId", function (req, res) {
  const widgetList = fs.readFileSync(
    path.join(__dirname, "pages/widget-list.json"),
    {
      encoding: "utf8",
    }
  );
  res.json(Reflect.get(JSON.parse(widgetList), req.params.pageId));
});

router.get("/:rKey/widget/:widgetId", function (req, res) {
  const widgetList = fs.readFileSync(
    path.join(__dirname, "pages", req.params.widgetId),
    {
      encoding: "utf8",
    }
  );
  res.send(widgetList);
});

router.get("/:rKey/logout", function (req, res) {
  const result = [
    // { message: "ok", redirectUrl: "https://trust-login.com" }
    { message: "ok", redirectUrl: "" }
  ];
  res.json(result);
});

module.exports = router;
