var express = require("express");
var router = express.Router();
router.use(express.json());

router.get("/:rKey/errorMessages", function (req, res) {
  const errors = {
    v: "1.4",
    messages: [
      {
        id: 1.0,
        messageType: 1, // 1 : success
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
        messageType: 2, // 2 : error

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
        messageType: 3, // 3 : info

        culture: [
          {
            lid: 1.0,
            message: "اطلاعات",
          },
          {
            lid: 2.0,
            message: "info message",
          },
        ],
      },
      {
        id: 4.0,

        culture: [
          {
            lid: 1.0,
            message: "تست",
          },
          {
            lid: 2.0,
            message: "test",
          },
        ],
      },
      {
        id: 5.0,

        culture: [
          {
            lid: 1.0,
            message: "تست",
          },
          {
            lid: 2.0,
            message: "test",
          },
        ],
      },
      {
        id: 6.0,

        culture: [
          {
            lid: 1.0,
            message: "تست تمپلیت شرکت {$}",
          },
          {
            lid: 2.0,
            message: "test",
          },
        ],
      },
    ],
  };

  res.json(errors);
});

module.exports = router;
