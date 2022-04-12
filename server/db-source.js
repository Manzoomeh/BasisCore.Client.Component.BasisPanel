var express = require("express");
var router = express.Router();
const MergeType = {
  replace: 0,
  append: 1,
};

const apiDataList = [];

for (let index = 1; index < 1000; index++) {
  const data = {
    id: index,
    count: Math.floor(Math.random() * 80),
    data: Math.random().toString(36).substring(7),
  };
  apiDataList.push(data);
}

router.get("/grid-options.js", function (req, res) {
  res.setHeader("content-type", "application/javascript");
  setTimeout(() => {
    res.send(`const demo_grid_options = {
        paging: 10
    };`);
  }, 3000);
});
router.post("/demo", function (req, res) {
  const MIN_ID = 1;
  const dataList = [];
  for (let index = MIN_ID; index < 300; index++) {
    dataList.push({
      id: index,
      count: Math.floor(Math.random() * 80),
      data: Math.random().toString(36).substring(7),
    });
  }

  const data = {
    setting: {
      keepalive: false,
    },
    sources: [
      {
        options: {
          tableName: "book.list",
          mergeType: MergeType.replace,
        },
        data: dataList,
      },
    ],
  };
  res.json(data);
});

module.exports = router;
