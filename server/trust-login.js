var fs = require("fs");
const path = require("path");
var express = require("express");
var router = express.Router();
const { active } = require("./active-manager");

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
        title: "میز کار ",
        pid: "default",
      },
      {
        title: "اطلاعات کاربری",
        pid: "userInfo",
      },
      {
        title: "مدیریت فایل ها",
        nodes: [
          { title: "فایل های من", pid: "myFiles1" },
          { title: "اشتراک با من", pid: 5 },
        ],
      },
      { title: "تقویم", pid: "myFiles" },
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
        url: "http://localhost:8080/server/external/task",
      },
    ],
  };
  res.json(result);
});

router.get("/:rKey/sidebarMenu/:pageId", function (req, res) {
  const result = {
    nodes: [
      {
        title: "اطلاعات کاربری",
        pid: "userInfo",
      },
      {
        title: "منوی 2",
        nodes: [
          { title: "فایل های من", pid: "myFiles" },
          { title: "تقویم", pid: "calendare" },
        ],
      },
      { title: "منو 2", pid: 3 },
      { title: "منو 3", pid: 4 },
      {
        title: "منو 4",
        nodes: [
          { title: "زیر منو 41", pid: 5 },
          { title: "زیر منو 42", pid: 6 },
        ],
      },
    ],
  };
  res.json(result);
});

// router.get("/:rKey/inactiveWidgets/:pageId", function (req, res) {
//   const widgetList = fs.readFileSync(
//     path.join(__dirname, "pages/inactive-widget-list.json"),
//     {
//       encoding: "utf8",
//     }
//   );
//   res.json(Reflect.get(JSON.parse(widgetList), req.params.pageId));
// });

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

router.get("/getDmnToken", function (req, res) {
  const result = { dmnToken: "asdfgh" };
  res.json(result);
});

router.post("/:rKey/logout", function (req, res) {
  const result = { errorid: 3, message: "ok", redirectUrl: "" };
  res.json(result);
});

router.get("/checkrkey/:rKey", function (req, res) {
  const result = {
    checked: true,
    userid: 122503,
    currentOwnerid: active.corporate,
    currentDmnid: active.business,
    ownerid: 30,
    dmnid: 30,
    rkey: req.params.rKey,
    usercat: "48,5475,",
    ERP: false,
  };
  res.json(result);
});

router.post("/:rKey/addtodashboard", function (req, res) {
  const result = { errorid: 4, message: "successful" };
  res.json(result);
});

router.post("/:rKey/removetempwidget", function (req, res) {
  const result = { errorid: 3, message: "successful" };
  res.json(result);
});

router.post("/:rKey/editcolormode", function (req, res) {
  const result = { errorid: 3, message: "colormode changed" };
  res.json(result);
});

router.get("/:rKey/visualmode", function (req, res) {
  const result = { colorMode: "light mode", viewMode: "grid" };
  res.json(result);
});

router.get("/:rKey/tempwidgets", function (req, res) {
  const result = [
    {
      id: 28,
      widgetid: 2,
      title: "تصویر پنل کاربری",
    },
    {
      id: 29,
      widgetid: 3,
      title: "ویرایش اطلاعات کاربری",
    },
  ];
  // const result = [];
  res.json(result);
});

module.exports = router;
