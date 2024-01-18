// const PostCode = require("../models").PostCode;
// const Query = new require("../queries/crud");
// const validate = require("../validations/validation");
const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.SENDGRID_API_KEY);
const Product = require("../models/product");
const { upload, rand } = require("../utility/global");
const mongoose = require("mongoose");
const {
  SERVER_ERROR,
  OK,
  VALIDATION_ERROR,
  Messages,
} = require("../errors/statusCode");
// const query = new Query(PostCode);

module.exports = {
  create: async (req, res) => {
    try {
      const photoObject = req.file;
      const photo = photoObject ? req.file.location : null;

      const {
        name,
        price,
        quantity,
        description,
        categoryId,
        weight,
        weightTypeId,
      } = req.body;

      //
      const data = Product({
        name: name,
        serial: rand(1, 100000) + rand(1, 100000),
        price: price,
        quantity: quantity,
        description: description,
        category: categoryId,
        weight: weight,
        weightType: weightTypeId,
        image: photo || "",
      });
      await data.save();

      return res.status(OK).send({ error: false });
    } catch (err) {
      console.log(err);
      return res.status(SERVER_ERROR).send({ error: true });
    }
  },
  findById: async (req, res) => {
    const id = req.body.id;

    try {
      const data = await Product.findById(id);
      return res.status(OK).send(data);
    } catch (err) {
      return res.status(OK).send({ error: true, message: err });
    }
  },
  findAll: async (req, res) => {
    try {
      const { page = 1, limit = 10 } = req.body;

      const data = await Product.find()
        .skip((page - 1) * limit) // Skip documents based on the current page
        .limit(limit)
        .populate("weightType");
      // .populate("status")
      // .populate("likes")
      // .populate("comments");
      return res.status(OK).send({ data: data });
    } catch (err) {
      console.log(err);
      return res.status(SERVER_ERROR).send({ error: true, message: err });
    }
  },

  findAllByCategory: async (req, res) => {
    try {
      const { page = 1, limit = 10, categoryId } = req.body;

      const data = await Product.find({ category: categoryId })
        .skip((page - 1) * limit) // Skip documents based on the current page
        .limit(limit)
        .populate("weightType");
      return res.status(OK).send({ data: data });
    } catch (err) {
      console.log(err);
      return res.status(SERVER_ERROR).send({ error: true, message: err });
    }
  },

  delete: async (req, res) => {
    try {
      const id = req.params.id;
      const data = await Product.findByIdAndDelete(id);
      return res.status(OK).send({ error: false });
    } catch (err) {
      return res.status(OK).send({ error: true, message: err });
    }
  },

  manipulate: async (req, res) => {
    try {
      const data = await Product.find();
      for (var item of data) {
        const options = { new: true };

        const result = await Product.findByIdAndUpdate(
          item._id,
          { isAvailable: true },
          options
        );
      }

      return res.status(OK).send({ error: false, result });
    } catch (err) {
      return res.status(OK).send({ error: true, message: err });
    }
  },
  update: async (req, res) => {
    try {
      console.log(req.params.id);
      const id = req.params.id;
      const photoObject = req.file;
      const photo = photoObject ? req.file.location : null;
      const { name, price, quantity, description, categoryId } = req.body;
      const updatedData = {
        name,
        price,
        quantity,
        description,
        category: categoryId,
        image: photo || "",
      };

      const options = { new: true };

      const result = await Product.findByIdAndUpdate(id, updatedData, options);

      return res.status(OK).send({ error: false, result });
    } catch (err) {
      return res.status(OK).send({ error: true, message: err });
    }
  },
};
