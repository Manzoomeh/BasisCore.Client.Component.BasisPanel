var express = require("express");
var router = express.Router();

// // middleware that is specific to this router
// router.use(function timeLog (req, res, next) {
//   console.log('Time: ', Date.now())
//   next()
// })
// define the home page route
router.get("/profile", function (req, res) {
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
// define the about route
router.get("/about", function (req, res) {
  res.send("About birds");
});

module.exports = router;
