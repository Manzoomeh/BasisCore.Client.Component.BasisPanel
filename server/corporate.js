const express = require("express");
const router = express.Router();

const hosts = [
  {
    ownerid: 8956,
    businesses: [],
  },
  {
    ownerid: 20,
    businesses: [],
  },
  {
    ownerid: 8844,
    businesses: [],
  },
  {
    ownerid: 7660,
    businesses: [
      {
        dmn_id: 4312,
        domain: "Bisko.ir",
      },
    ],
  },
  {
    ownerid: 8935,
    businesses: [],
  },
  {
    ownerid: 7,
    businesses: [
      {
        dmn_id: 3460,
        domain: "manzoomehnet.ir",
      },
      {
        dmn_id: 3461,
        domain: "www.namayeshgah.ir",
      },
    ],
  },
  {
    ownerid: 5,
    businesses: [
      {
        dmn_id: 5,
        domain: "seller.ir",
      },
    ],
  },
  {
    ownerid: 8327,
    businesses: [
      {
        dmn_id: 3842,
        domain: "abashimi.com",
      },
    ],
  },
  {
    ownerid: 8898,
    businesses: [
      {
        dmn_id: 3715,
        domain: "abineseir.com",
      },
    ],
  },
  {
    ownerid: 8478,
    businesses: [
      {
        dmn_id: 3973,
        domain: "arttechnical-co.com",
      },
      {
        dmn_id: 3974,
        domain: "arttechnical.ir",
      },
    ],
  },
  {
    ownerid: 1,
    businesses: [
      {
        dmn_id: 7,
        domain: "basiscore.com",
      },
      {
        dmn_id: 9,
        domain: "iranact.com",
      },
      {
        dmn_id: 19,
        domain: "basisevent.com",
      },
      {
        dmn_id: 2668,
        domain: "school.basiscore.com",
      },
      {
        dmn_id: 2893,
        domain: "manzoomeh.ir",
      },
      {
        dmn_id: 3241,
        domain: "basiscore.ir",
      },
    ],
  },
  {
    ownerid: 8625,
    businesses: [
      {
        dmn_id: 2933,
        domain: "old",
      },
      {
        dmn_id: 3565,
        domain: "mehrsunDelete",
      },
      {
        dmn_id: 4222,
        domain: "mehrsunnovin.com",
      },
    ],
  },
  {
    ownerid: 8282,
    businesses: [],
  },
  {
    ownerid: 8479,
    businesses: [
      {
        dmn_id: 4042,
        domain: "mackesh-dahesh.ir",
      },
      {
        dmn_id: 4086,
        domain: "mackesh-dahesh.com",
      },
    ],
  },
  {
    ownerid: 8355,
    businesses: [
      {
        dmn_id: 2607,
        domain: "mitragasht.com",
      },
    ],
  },
];
router.get("/:rKey/list", function (req, res) {
  const result = [
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
  res.json(result);
});

router.get("/:rKey/list", function (req, res) {
  const result = [
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
  res.json(result);
});
module.exports = router;
