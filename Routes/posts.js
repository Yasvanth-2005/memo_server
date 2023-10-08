const express = require("express");
const router = express.Router();
const postMessages = require("../Models/post");
const userTokenCheck = require("../middleware/UserCheck");

router.get("/", async (req, res) => {
  try {
    const Posts = await postMessages.find();
    res.status(200).json(Posts);
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: "something is wrong with server" });
  }
});

router.post("/", userTokenCheck, async (req, res) => {
  const { creator, title, description, image, tags } = req.body;
  try {
    const newPost = await postMessages.create({
      creator,
      title,
      description,
      image,
      tags,
    });
    res.status(200).json(newPost);
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: "something is wrong with server" });
  }
});

router.patch("/:id", userTokenCheck, async (req, res) => {
  const { id } = req.params;
  const { creator, title, description, image, tags } = req.body;
  if (req.user.user.username !== creator) {
    return res.status(403).json({ message: "You Can't edit others post" });
  }
  try {
    const updatesPost = await postMessages.findByIdAndUpdate(id, {
      creator,
      title,
      description,
      image,
      tags,
    });
    res.status(200).json(updatesPost);
  } catch (error) {
    console.log(err);
    res.status(400).json({ message: "something is wrong with server" });
  }
});

router.delete("/:id", userTokenCheck, async (req, res) => {
  const { id } = req.params;
  const currentPost = await postMessages.findById(id);
  if (req.user.user.username !== currentPost.creator) {
    return res.status(403).json({ message: "You Can't delete others post" });
  }
  try {
    await postMessages.findByIdAndDelete(id);
    res.status(200).json({ message: "Post Deleted Successfully" });
  } catch (error) {
    console.log(error.message);
    res
      .status(error.statusCode)
      .json({ message: "Something went wrong , post not deleted" });
  }
});

module.exports = router;
