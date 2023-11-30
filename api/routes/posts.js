const express = require("express");
const Posts = require("../models/Posts");
const { isAuthenticated, hasRoles } = require("../auth");

const router = express.Router();

router.get("/", (req, res) => {
  Posts.find(
    { status: true },
    {
      name: 1,
      nationality: 1,
      images: 1,
      rate_1h: 1,
      verified: 1,
      districtValue: 1,
    }
  )
    .exec()
    .then((x) => res.status(200).send(x));
});

router.get("/:id", (req, res) => {
  Posts.findById(req.params.id)
    .exec()
    .then((x) => res.status(200).send(x));
});

router.get("/me/:uuid", (req, res) => {
  Posts.find({ uuid: req.params.uuid })
    .exec()
    .then((x) => res.status(200).send(x));
});

router.post("/", isAuthenticated, (req, res) => {
  Posts.create({ ...req.body }).then((x) =>
    res.status(201).json({
      status: 201,
      data: null,
      message: "Post creado con exito",
    })
  );
});

router.put("/:id", isAuthenticated, hasRoles(["admin", "user"]), (req, res) => {
  Posts.findByIdAndUpdate({ _id: req.params.id }, req.body).then((x) =>
    res.sendStatus(204)
  );
});

router.delete("/:id", isAuthenticated, (req, res) => {
  Posts.findOneAndDelete(req.params.id)
    .exec()
    .then(() => res.sendStatus(204));
});

module.exports = router;
