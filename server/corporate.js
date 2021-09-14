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
module.exports = router;
