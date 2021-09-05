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

router.get("/:rKey/menu", function (req, res) {
  //console.log("menu", req.params);
  const result = {
    nodes: [
      {
        title: "اطلاعات کاربری",
        pid: "1",
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
        url: "/server/trust/${rKey}/external-menu/calender",
      },
      {
        mid: 4,
        title: "TaskManager",
        multi: false,
        url: "/server/trust/${rKey}/external-menu/task",
      },
    ],
  };
  res.json(result);
});

router.get("/:rKey/external-menu/calender", function (req, res) {
  const result = {
    nodes: [
      {
        title: "مدیریت پیام ها",
        nodes: [
          { title: "لیست پیام ها", pid: 11 },
          { title: "مدیریت برچسب ها", pid: 13 },
        ],
      },
    ],
  };
  res.json(result);
});

router.get("/:rKey/external-menu/task", function (req, res) {
  const result = {
    nodes: [
      {
        title: "مدیریت تسک",
        pid: "19",
      },
    ],
  };
  res.json(result);
});

module.exports = router;
