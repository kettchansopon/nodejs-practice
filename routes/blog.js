var express = require("express");
var router = express.Router();

// ...rest of the initial code omitted for simplicity.
const { check, validationResult } = require("express-validator");
const db = require("monk")("localhost:27017/TutorialDB");

/* GET products listing. */
router.get("/", function (req, res, next) {
  req.flash("success", "ยินดีตอนรับ!");
  res.render("blog");
});

router.get("/add", function (req, res, next) {
  res.render("addblog");
});

router.post(
  "/add",
  [
    check("name", "กรุณาป้อนชื่อบทความ!").not().isEmpty(),
    check("description", "กรุณาใส่เนื้อหาบทความ!").not().isEmpty(),
    check("author", "กรุณาระบุชื่อผู้แต่ง!").not().isEmpty(),
  ],
  function (req, res, next) {
    // Finds the validation errors in this request and wraps them in an object with handy functions
    const result = validationResult(req);
    var errors = result.errors;
    if (!result.isEmpty()) {
      res.render("addblog", { errors: errors });
    } else {
      //insert to database
      const collection = db.get("blogs");
      collection.insert(
        {
          name: req.body.name,
          description: req.body.description,
          author: req.body.author,
        },
        function (err, blog) {
          if (err) {
            res.send(err);
          } else {
            req.flash("success", "บันทึกบทความเรียบร้อย!");
            res.location("/blog/add");
            res.redirect("/blog/add");
          }
        }
      );
    }
  }
);

module.exports = router;
