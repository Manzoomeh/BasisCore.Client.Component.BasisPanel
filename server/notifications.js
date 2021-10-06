var express = require("express");
var router = express.Router();

router.get("/:rKey/unread-messages", function (req, res) {
  const result = [
    { img: "/assets/images/01.png", title: "zahra", seeMore: "test description1", date: "1400/07/01 13:15" },
    { img: "/assets/images/01.png", title: "maryam", seeMore: "test description2", date: "1400/07/02 13:15" },
    { img: "/assets/images/01.png", title: "ghadire", seeMore: "test description3", date: "1400/07/03 13:15" },
    { img: "/assets/images/01.png", title: "akbari", seeMore: "test description4", date: "1400/07/04 13:15" },
    { img: "/assets/images/01.png", title: "moradi", seeMore: "test description5", date: "1400/07/05 13:15" },
    { img: "/assets/images/01.png", title: "jafarzade", seeMore: "test description6", date: "1400/07/06 13:15" },
  ];
  // const result = [];
  res.json(result);
});

router.get("/:rKey/new-tasks", function (req, res) {
  const result = [
    { img: "/assets/images/01.png", title: "BasisPanel", seeMore: "test description1", date: "1400/07/01 13:15" },
    { img: "/assets/images/01.png", title: "Client", seeMore: "test description2", date: "1400/07/02 13:15" },
    { img: "/assets/images/01.png", title: "DGTalent", seeMore: "test description3", date: "1400/07/03 13:15" },
    { img: "/assets/images/01.png", title: "Fingerfood", seeMore: "test description4", date: "1400/07/04 13:15" },
    { img: "/assets/images/01.png", title: "Grid", seeMore: "test description5", date: "1400/07/05 13:15" },
    { img: "/assets/images/01.png", title: "Academy", seeMore: "test description6", date: "1400/07/06 13:15" },
  ];
  // const result = [];
  res.json(result);
});

router.get("/:rKey/new-notes", function (req, res) {
  const result = [];
  res.json(result);
});

module.exports = router;
