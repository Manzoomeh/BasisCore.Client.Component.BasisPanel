var express = require("express");
var router = express.Router();
router.use(express.json());

router.get("/:rKey/errorMessages", function (req, res) {
  const errors = [
    {
      v: "1.4",
    },
    {
      id: 1.0,
      culture: [
        {
          lid: 1.0,
          message: "با موفقیت انجام شد",
        },
        {
          lid: 2.0,
          message: "successful",
        },
      ],
    },
    {
      id: 2.0,
      culture: [
        {
          lid: 1.0,
          message: "خطا در انجام عملیات ",
        },
        {
          lid: 2.0,
          message: "its fail",
        },
      ],
    },
    {
      id: 3.0,
      culture: [
        {
          lid: 1.0,
          message: "test",
        },
        {
          lid: 2.0,
          message: "its fail",
        },
      ],
    },
  ];
  

  res.json(errors);
});
module.exports = router;
