const express = require("express");
const router = express.Router();

const hosts = [
  {
    id: 4312,
    title: "Bisko.ir",
    ownerid: 7660,
  },
  {
    id: 3460,
    title: "manzoomehnet.ir",
    ownerid: 7,
  },
  {
    id: 3461,
    title: "www.namayeshgah.ir",
    ownerid: 7,
  },
  {
    id: 5,
    title: "seller.ir",
    ownerid: 5,
  },
  {
    id: 3842,
    title: "abashimi.com",
    ownerid: 8327,
  },
  {
    id: 3715,
    title: "abineseir.com",
    ownerid: 8898,
  },
  {
    id: 3973,
    title: "arttechnical-co.com",
    ownerid: 8478,
  },
  {
    id: 3974,
    title: "arttechnical.ir",
    ownerid: 8478,
  },
  {
    id: 7,
    title: "basiscore.com",
    ownerid: 1,
  },
  {
    id: 9,
    title: "iranact.com",
    ownerid: 1,
  },
  {
    id: 19,
    title: "basisevent.com",
    ownerid: 1,
  },
  {
    id: 2668,
    title: "school.basiscore.com",
    ownerid: 1,
  },
  {
    id: 2893,
    title: "manzoomeh.ir",
    ownerid: 1,
  },
  {
    id: 3241,
    title: "basiscore.ir",
    ownerid: 1,
  },
  {
    id: 2933,
    title: "old",
    ownerid: 8625,
  },
  {
    id: 3565,
    title: "mehrsunDelete",
    ownerid: 8625,
  },
  {
    id: 4222,
    title: "mehrsunnovin.com",
    ownerid: 8625,
  },
  {
    id: 4042,
    title: "mackesh-dahesh.ir",
    ownerid: 8479,
  },
  {
    id: 4086,
    title: "mackesh-dahesh.com",
    ownerid: 8479,
  },
  {
    id: 2607,
    title: "mitragasht.com",
    ownerid: 8355,
  },
];
router.get("/:rKey/list/:id", function (req, res) {
  const id = parseInt(req.params.id);
  res.json(hosts.filter((x) => x.ownerid === id));
});

module.exports = router;
