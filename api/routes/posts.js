const express = require("express");
const Posts = require("../models/Posts");
const { isAuthenticated, hasRoles } = require("../auth");

const router = express.Router();

router.get("/", async (req, res) => {
  const limit = req.query.limit || 30;
  const page = req.query.page || 1;

  const posts = await Posts.paginate(
    { status: true },
    {
      limit,
      page,
    },
    {
      name: 1,
      nationality: 1,
      images: 1,
      rate_1h: 1,
      verified: 1,
      districtValue: 1,
      age: 1,
      alwaysOn: 1,
    }
  );

  return res.status(200).send({ posts });
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

router.delete("/:uuid", isAuthenticated, (req, res) => {
  Posts.findOneAndDelete({ uuid: req.params.uuid })
    .exec()
    .then(() => res.sendStatus(204));
});

module.exports = router;
