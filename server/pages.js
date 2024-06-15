var express = require("express");

module.exports = function (category) {
  var router = express.Router();

  router.get("/:pageId", function (req, res) {
    res.redirect(
      `../../Desktop_FA.html?category=${category}&pageId=${req.params.pageId}`
    );
  });
  router.get("/:moduleId/:pageId", function (req, res) {
    res.redirect(
      `../../Desktop_FA.html?category=${category}&moduleName=demo&moduleId=${req.params.moduleId}&pageId=${req.params.pageId}`
    );
  });

  return router;
};
