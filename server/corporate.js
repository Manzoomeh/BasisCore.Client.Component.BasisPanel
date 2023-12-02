var fs = require("fs");
const path = require("path");
const express = require("express");
const router = express.Router();
const { active } = require("./active-manager");

const corporateList = [
  {
    id: 8956,
    title: "Avasys",
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
router.get("/:rKey/widget/:widgetId", function (req, res) {
  const widgetList = fs.readFileSync(
    path.join(__dirname, "pages", req.params.widgetId),
    {
      encoding: "utf8",
    }
  );
  res.send(widgetList);
});
router.get("/:rKey/issues", function (req, res) {
  res.send([
    {
      issueid: 6044,
      issuetitle: "داینامیک کردن صفحه تماس با ما - موبایل",
      user: 1042574,
      fname: "محسن",
      lname: "کریموند",
      date: "1402/8/28   15:11:47",
      issuetypeid: 2045,
      epicname: "طراحی نسخه موبایل",
      color: "#40a6c4",
      labelname: "",
      labelcolor: "",
      priority: "",
      priorityicon: "",
      issuedesc: "",
      statusid: 1265,
      status: null,
    },
    {
      issueid: 6045,
      issuetitle: "داینامیک کردن صفحه درباره ما - موبایل",
      user: 1042574,
      fname: "محسن",
      lname: "کریموند",
      date: "1402/8/28   15:12:14",
      issuetypeid: 2045,
      epicname: "طراحی نسخه موبایل",
      color: "#40a6c4",
      labelname: "",
      labelcolor: "",
      priority: "",
      priorityicon: "",
      issuedesc: "",
      statusid: 1265,
      status: null,
    },
  ]);
});
router.post("/:rKey/addrelation", function (req, res) {
  res.send({ errorid: 5, message: "successful", id: 1234 });
});
router.get("/:rKey/columns", function (req, res) {
  res.send([
    {
      id: 1265,
      statustitle: "Done",
      color: "#00A693",
    },
    {
      id: 1301,
      statustitle: "Doing",
      color: "#f7ca86",
    },
    {
      id: 1337,
      statustitle: "To Do",
      color: "#797979",
    },
    {
      id: 1824,
      statustitle: "تاییده شده",
      color: "#2f7dd5",
    },
    {
      id: 2169,
      statustitle: "رد شده",
      color: "#d21545",
    },
  ]);
});
module.exports = router;
