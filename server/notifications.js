var express = require("express");
var router = express.Router();

router.get("/:rKey/unread-messages", function (req, res) {
  const result = [
    { id: "1", img: "/assets/images/01.png", title: "zahra", seeMore: "test description1", date: "1400/07/01 13:15" },
    { id: "2", img: "/assets/images/01.png", title: "maryam", seeMore: "test description2", date: "1400/07/02 13:15" },
    { id: "3", img: "/assets/images/01.png", title: "ghadire", seeMore: "test description3", date: "1400/07/03 13:15" },
    { id: "4", img: "/assets/images/01.png", title: "akbari", seeMore: "test description4", date: "1400/07/04 13:15" },
    { id: "5", img: "/assets/images/01.png", title: "moradi", seeMore: "test description5", date: "1400/07/05 13:15" },
    { id: "6", img: "/assets/images/01.png", title: "jafarzade", seeMore: "test description6", date: "1400/07/06 13:15" },
    { id: "7", img: "/assets/images/01.png", title: "elham", seeMore: "test description7", date: "1400/07/07 13:15" },
    { id: "8", img: "/assets/images/01.png", title: "gharebaghi", seeMore: "test description8", date: "1400/07/08 13:15" },
    { id: "9", img: "/assets/images/01.png", title: "shima", seeMore: "test description9", date: "1400/07/09 13:15" },
    { id: "10", img: "/assets/images/01.png", title: "shahrokhi", seeMore: "test description10", date: "1400/07/10 13:15" },
  ];
  // const result = [];
  res.json(result);
});

router.get("/:rKey/new-tasks", function (req, res) {
  const result = [
    { id: "1", img: "/assets/images/01.png", title: "BasisPanel", seeMore: "test description1", date: "1400/07/01 13:15" },
    { id: "2", img: "/assets/images/01.png", title: "Client", seeMore: "test description2", date: "1400/07/02 13:15" },
    { id: "3", img: "/assets/images/01.png", title: "DGTalent", seeMore: "test description3", date: "1400/07/03 13:15" },
    { id: "4", img: "/assets/images/01.png", title: "Fingerfood", seeMore: "test description4", date: "1400/07/04 13:15" },
    { id: "5", img: "/assets/images/01.png", title: "Grid", seeMore: "test description5", date: "1400/07/05 13:15" },
    { id: "6", img: "/assets/images/01.png", title: "Academy", seeMore: "test description6", date: "1400/07/06 13:15" },
  ];
  // const result = [];
  res.json(result);
});

router.get("/:rKey/new-notes", function (req, res) {
  const result = [];
  res.json(result);
});

module.exports = router;