var fs = require("fs");
const path = require("path");
const express = require("express");
const router = express.Router();
const { active } = require("./active-manager");

const corporateList = [
  {
    id: 7660,
    title: "Bisko",
  },
];
router.get("/:rKey/list", function (req, res) {
  res.json(corporateList);
});

router.get("/:rKey/menu", function (req, res) {
  const corporate = corporateList.find((x) => x.id == active.corporate);
  const result = { nodes: [] };
  if (corporate) {
    result.nodes.push({
      title: `منوی شرکت ${corporate.title}`,
      nodes: [
        {
          title: `زیر منوی اول شرکت ${corporate.title}`,
          pid: corporate.id * 3,
        },
        {
          title: `زیر منوی دوم شرکت ${corporate.title}`,
          pid: corporate.id * 4,
        },
      ],
    });
  }
  res.json(result);
});

router.get("/:rKey/page/:pageId", function (req, res) {
  const widgetList = fs.readFileSync(
    path.join(__dirname, "pages/corporate-widget-list.json"),
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

module.exports = router;
