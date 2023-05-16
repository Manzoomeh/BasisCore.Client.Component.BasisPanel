var express = require("express");

module.exports = function (category) {
  var router = express.Router();

  router.get("/:pageId", function (req, res) {
    res.redirect(
      `../../Desktop_FA.html?category=${category}&pageId=${req.params.pageId}`
    );
  });

  return router;
};
