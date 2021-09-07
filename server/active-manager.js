const express = require("express");
const router = express.Router();
router.use(express.json());

router.use(
  express.urlencoded({
    extended: true,
  })
);

const active = {
  corporate: 0,
  business: 0,
};

router.post("/:rKey/set-active", function (req, res) {
  if (req.body.type === "corporate") {
    active.corporate = req.body.id;
  } else if (req.body.type === "business") {
    active.business = req.body.id;
  }
  res.json({ result: "ok", data: active });
});

module.exports = { router, active };
