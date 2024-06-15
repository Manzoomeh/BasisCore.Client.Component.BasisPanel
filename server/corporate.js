var fs = require("fs");
const path = require("path");
const express = require("express");
const router = express.Router();
const { active } = require("./active-manager");

const corporateList = [
  {
    id: 8956,
    title: "Avasys",
    erp: true,
  },
  {
    id: 20,
    title: "BasisDocs",
  },
  {
    id: 8844,
    title: "BHK",
  },
  {
    id: 7660,
    title: "Bisko",
  },
  {
    id: 8935,
    title: "BROTHER",
  },
  {
    id: 7,
    title: "manzoomehnet.ir",
  },
  {
    id: 5,
    title: "Seller.ir",
  },
  {
    id: 8327,
    title: "آبا-شیمی",
  },
  {
    id: 8898,
    title: "آبینه-سیر-آبشار",
  },
  {
    id: 8478,
    title: "آرت-تکنیکال",
  },
  {
    id: 1,
    title: "منظومه نگاران",
  },
  {
    id: 8625,
    title: "مهرسان-نوین",
  },
  {
    id: 8282,
    title: "مهرستا",
  },
  {
    id: 8479,
    title: "مکش-و-دهش",
  },
  {
    id: 8355,
    title: "میترا-گشت",
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
          title: `زیر منوی پیش فرض شرکت ${corporate.title}`,
          pid: "default",
        },
        {
          title: `زیر منوی اول شرکت ${corporate.title}`,
          pid: (corporate.id * 3).toString(),
        },
        {
          title: `زیر منوی دوم شرکت ${corporate.title}`,
          pid: (corporate.id * 4).toString(),
        },
      ],
    });
  }
  res.json(result);
});

router.get("/:rKey/page/:pageId", function (req, res) {
  const corporate = corporateList.find((x) => x.id == active.corporate);
  const widgetList = fs.readFileSync(
    path.join(__dirname, "pages/corporate-widget-list.json"),
    {
      encoding: "utf8",
    }
  );
  let result = Reflect.get(JSON.parse(widgetList), req.params.pageId);
  if (!result) {
    result = {
      container: "container",
      groups: [
        {
          groupName: "group1",
          options: {
            repositories: {
              "bc.grid": "/assets/js/basiscore.grid.component.js",
            },
            settings: {},
          },
          widgets: [
            {
              id: `corporateWidget-${req.params.pageId}.html`,
              title: `ویجت شرکت ${corporate.title}`,
              name: `corporateWidget-${req.params.pageId}`,
              container: "widget",
              x: 0,
              y: 0,
              w: 12,
              h: 2,
            },
          ],
          deactiveWidgets: [],
        },
      ],
    };
  }
  res.json(result);
});

router.get("/:rKey/widget/:widgetId", function (req, res) {
  const corporate = corporateList.find((x) => x.id == active.corporate);
  const widgetContent = fs.readFileSync(
    path.join(__dirname, "pages", "corporateWidget1.html"),
    {
      encoding: "utf8",
    }
  );
  res.send(
    widgetContent
      .replace("{0}", corporate?.title)
      .replace("{1}", req.params.widgetId)
  );
});

module.exports = router;
