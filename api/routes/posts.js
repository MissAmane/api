const express = require("express");
const Posts = require("../models/Posts");
const { isAuthenticated, hasRoles } = require("../auth");

const router = express.Router();

router.get("/", async (req, res) => {
  const limit = req.query.limit || 30;
  const page = req.query.page || 1;
  const select =
    "name nationality images profession rate_1h verified districtValue age alwaysOn days iniTime endTime";

  const posts = await Posts.paginate(
    { status: true },
    {
      limit,
      page,
      select,
      sort: {
        verified: 1,
      },
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
