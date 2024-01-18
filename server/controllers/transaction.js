// const PostCode = require("../models").PostCode;
// const Query = new require("../queries/crud");
// const validate = require("../validations/validation");
const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.SENDGRID_API_KEY);
const Transaction = require("../models/transaction");
const Total = require("../models/total");
const Reward = require("../models/reward");
const { upload, rand, pointDispatcher } = require("../utility/global");
const mongoose = require("mongoose");
const { SERVER_ERROR, OK } = require("../errors/statusCode");
const stripe = require("stripe")(process.env.STRIPE);
// const query = new Query(PostCode);

module.exports = {
  create: async (req, res) => {
    try {
      const id = req.userData.id;
      const {
        subTotal,
        productArray,
        total,
        deliveryPrice,
        discount,
        address,
      } = req.body;
      console.log(req.body);
      const totalData = Total({
        transactionId: rand(11111111, 99999999),
        subTotal: subTotal,
        discount: discount,
        total: total,
        deliveryPrice: deliveryPrice,
        user: id,
        address: address,
      });
      await totalData.save();
      productArray.forEach(async (item) => {
        const data = Transaction({
          totalId: totalData._id,
          name: item.name,
          product: item.id,
          price: item.price,
          quantity: item.quantity,
          user: id,
        });
        await data.save();
      });

      const getReward = await Reward.findOne({ user: id });
      if (getReward) {
        const options = { new: true };
        await Reward.findByIdAndUpdate(
          getReward._id,
          { points: point + getReward.pont },
          options
        );
      } else {
        const data = Reward({
          points: pointDispatcher(total),
          user: id,
        });
        data.save();
      }

      return res.status(OK).send({ error: false });
    } catch (err) {
      console.log(err);
      return res.status(SERVER_ERROR).send({ error: true });
    }
  },
  getUserReward: async (req, res) => {
    try {
      const id = req.userData.id;
      let dataObject = {};
      const data = await Reward.findOne({ user: id });
      dataObject.points = data.points || 0;
      dataObject.max = 2000;

      return res.status(OK).send(dataObject);
    } catch (err) {
      console.log(err);
      return res.status(SERVER_ERROR).send({ error: true });
    }
  },
  userTotal: async (req, res) => {
    try {
      const newArray = [];
      const id = req.userData.id;
      const totalData = await Total.find({ user: id }).sort({
        createdAt: -1,
      });
      for (item of totalData) {
        const data = await Transaction.find({
          totalId: item._id,
        });
        newArray.push({
          total: item.total,
          subTotal: item.subTotal,
          deliveryPrice: item.deliveryPrice,
          discount: item.discount,
          address: item.address,
          transactions: data,
          createdAt: item.createdAt,
          transactionId: item.transactionId,
        });
      }

      return res.status(OK).send({ error: false, data: newArray });
    } catch (err) {
      console.log(err);
      return res.status(SERVER_ERROR).send({ error: true });
    }
  },

  userTransactionsById: async (req, res) => {
    try {
      let { totalId } = req.body;
      const id = req.userData.id;

      const data = await Transaction.find({ totalId }).sort({
        createdAt: -1,
      });

      return res.status(OK).send({ error: false, data: data });
    } catch (err) {
      console.log(err);
      return res.status(SERVER_ERROR).send({ error: true });
    }
  },
  stripePayment: async (req, res) => {
    let { amount } = req.body;
    amount = parseInt(amount * 100);
    const lineItem = [
      {
        price_data: {
          currency: "gbp",
          product_data: {
            name: `Payment for Grocery`,
          },
          unit_amount: amount,
        },
        quantity: 1,
      },
    ];
    data = {
      payment_method_types: ["card"],
      line_items: lineItem,
      mode: "payment",
      success_url: "https://success",
      cancel_url: "https://error",
    };

    const session = await stripe.checkout.sessions.create(data);

    res.status(OK).send(session.id);
  },
};
