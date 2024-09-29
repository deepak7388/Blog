const blogModel = require("../models/blog");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();
const SECRET_KEY = process.env.SECRET_KEY;
const fs = require("fs");

const create = async (req, res) => {
  // console.log("req",req);
  console.log("form data: ", req.file, req.cookies);
  const { originalname, path } = req.file;
  // console.log("or",originalname,path);
  const parts = originalname.split(".");
  const ext = parts[parts.length - 1];
  const newPath = path + "." + ext;
  fs.renameSync(path, newPath);

  const { token } = req.cookies;
  jwt.verify(token, SECRET_KEY, {}, async (err, info) => {
    if (err) throw err;
    const { title, summary, description } = req.body;
    const blogDoc = await blogModel.create({
      title,
      summary,
      description,
      cover: newPath,
      author: info.id,
    });
    res.json(blogDoc);
  });
};

const getBlogs = async (req, res) => {
  const blogs = await blogModel
    .find()
    .populate("author", ["username"])
    .sort({ createdAt: -1 });
  console.log("blogs", blogs);
  res.json(blogs);
};

const getBlog = async (req, res) => {
  const { id } = req.params;
  console.log("id: ", id);
  const blog = await blogModel.findById(id).populate("author", ["username"]);
  res.json(blog);
};

const editBlog = async (req, res) => {
  const { id } = req.params;
  console.log("id:", id);
  let newPath = null;
  if (req.file) {
    const { originalname, path } = req.file;
    // console.log("or",originalname,path);
    const parts = originalname.split(".");
    const ext = parts[parts.length - 1];
    newPath = path + "." + ext;
    fs.renameSync(path, newPath);
  }
  console.log("np:", newPath);
  const { token } = req.cookies;
  jwt.verify(token, SECRET_KEY, {}, async (err, info) => {
    if (err) throw err;
    const { title, summary, description } = req.body;
    console.log("request: ", req.body);
    // console.log("info",title,summary,description);
    const blogDoc = await blogModel.findById(id);
    // console.log(JSON.stringify(blogDoc.author._id),JSON.stringify(info.id));

    const isAuthor =
      JSON.stringify(blogDoc.author._id) === JSON.stringify(info.id);
    console.log(isAuthor);
    if (!isAuthor) {
      return res.status(400).json("you are not the author");
    }
    // console.log(blogDoc);
    if (blogDoc) {
      // Update the properties of the blogDoc object
      blogDoc.title = title;
      blogDoc.summary = summary;
      blogDoc.description = description;
      blogDoc.cover = newPath ? newPath : blogDoc.cover;
      // Save the updated document to the database
      await blogDoc.save();
      console.log("Document updated successfully.");
    } else {
      console.log("Document not found.");
    }
    res.json(blogDoc);
  });
};

const deleteBlog = async (req, res) => {
  const { id } = req.params;
  try {
    const { token } = req.cookies;
    jwt.verify(token, SECRET_KEY, {}, async (err, info) => {
      if (err) throw err;
      const blogDoc = await blogModel.findById(id);
      console.log("blog", blogDoc);
      // const blog=await blogModel.findByIdAndRemove(id);
      const isAuthor =
        JSON.stringify(blogDoc.author._id) === JSON.stringify(info.id);
      console.log(isAuthor);
      if (!isAuthor) {
        return res.status(400).json("you are not the author");
      }
      try {
        const cover = blogDoc.cover;
        fs.access(cover, fs.constants.F_OK, (err) => {
          if (err) {
            console.log("image not found");
          }
          fs.unlink(cover, (err) => {
            if (err) {
              console.error("Error deleting image:", err);
            }

            // If the image file is deleted successfully, you can now proceed with deleting the blog from your database
            // Your blog deletion code here...
            console.log("Image deleted successfully");
          });
        });
        await blogModel.findByIdAndRemove(id);
        return res.status(202).json(blogDoc);
      } catch (error) {
        console.error("Error deleting blog:", error);
        return res.status(500).json({ message: "Error deleting blog" });
      }
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "something went wrong" });
  }
};

module.exports = { create, getBlogs, getBlog, editBlog, deleteBlog };
