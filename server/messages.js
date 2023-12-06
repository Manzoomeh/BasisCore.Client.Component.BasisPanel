var express = require("express");
var router = express.Router();
router.use(express.json());

router.post("/:rKey/errorMessages", function (req, res) {
  const errors = [
    {
      id: 1,
      culture: [
        {
          lid: 1,
          message: "با موفقیت انجام شد",
        },
        {
          lid: 2,
          message: "successful",
        },
      ],
    },
    {
      id: 2,
      culture: [
        {
          lid: 1,
          message: "خطا در انجام عملیات ",
        },
        {
          lid: 2,
          message: "its fail",
        },
      ],
    },
  ];

  const { id, lid } = req.body;
  const result = errors
    .find((e) => e.id == id)
    ?.culture.find((e) => e.lid == lid);
  // const result = [];
  res.json({ ...result, v: "1.3" });
});
module.exports = router;
