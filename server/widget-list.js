const express = require("express");
const router = express.Router();
router.use(express.json());

const widgets = [
  {
    id: "userWidget1.html",
    title: "ویجت داشبورد",
    name: "userWidget1",
    w: 12,
    h: 4,
    icon: `data:image/svg+xml;utf8,<svg width="116" height="70" viewBox="0 0 116 70" fill="none" xmlns="http://www.w3.org/2000/svg">
<rect width="116" height="70" rx="5" fill="#E4E7F4"/>
<mask id="mask0_12273_103335" style="mask-type:alpha" maskUnits="userSpaceOnUse" x="0" y="0" width="116" height="70">
<rect width="116" height="70" rx="5" fill="#E4E7F4"/>
</mask>
<g mask="url(#mask0_12273_103335)">
<path d="M112.749 26.3801L121.932 40.721L107.591 49.9042L98.4076 35.5633L112.749 26.3801ZM79.9424 21.3886L76.2583 38.1915L59.4553 34.5074L63.1394 17.7045L79.9424 21.3886ZM112.739 72.6062L109.055 89.4091L92.2524 85.725L95.9365 68.9221L112.739 72.6062ZM115.327 14.618L86.2255 32.8923L104.92 62.0863L89.3771 58.6786L82.0089 92.2844L115.615 99.6526L122.983 66.0468L104.92 62.0863L133.694 43.2999L115.327 14.618ZM90.1859 14.8292L56.58 7.46096L49.2118 41.0668L82.8177 48.435L90.1859 14.8292ZM70.7321 63.3959L67.048 80.1989L50.2451 76.5148L53.9292 59.7118L70.7321 63.3959ZM80.9756 56.8365L47.3698 49.4683L40.0016 83.0742L73.6074 90.4424L80.9756 56.8365Z" fill="#004B85" fill-opacity="0.15"/>
<path d="M61.7 27.8L64.5 30.6L61.7 33.4L58.9 30.6L61.7 27.8ZM54 28.3V32.3H50V28.3H54ZM64 38.3V42.3H60V38.3H64ZM61.7 25L56 30.6L61.7 36.3H58V44.3H66V36.3H61.7L67.3 30.6L61.7 25ZM56 26.3H48V34.3H56V26.3ZM54 38.3V42.3H50V38.3H54ZM56 36.3H48V44.3H56V36.3Z" fill="#004B85"/>
</g>
</svg>
`,
  },
  {
    id: "external-file.html",
    title: "اکسترنال ویجت",
    name: "externalFile",
    w: 6,
    h: 4,
    container: "widget",
    icon: "asset/images/reminders_1.png",
  },
];

router.get("/:rkey/:pageId", function (req, res) {
  res.json(widgets);
});

router.post("/:rkey/:pageId", function (req, res) {
  // console.log(req.body);
  res.json(true);
});
router.post("/saveWidgets/:rkey/:pageId", function (req, res) {
  // console.log(req.body);
  res.json({ errorid: 3, message: "successful" });
});
module.exports = router;
