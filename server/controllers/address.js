const Address = require("../models/address");
const { upload } = require("../utility/global");

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
      const userId = req.userData.id;
      const { address, postCode, city } = req.body;

      //
      const userAddress = await Address.find({ user: userId });
      const data = Address({
        address: address,
        postCode: postCode,
        user: userId,
        isDefault: userAddress.length > 0 ? false : true,
        city: city,
      });
      await data.save();

      return res.status(OK).send({ error: false });
    } catch (err) {
      return res.status(SERVER_ERROR).send({ error: true });
    }
  },
  findDefaultAddress: async (req, res) => {
    const id = req.userData.id;
    let data;
    try {
      data = await Address.findOne({ user: id, isDefault: true });
      if (data == null) {
        data = await Address.findOne({ user: id, isDefault: false });
      }
      return res.status(OK).send(data);
    } catch (err) {
      return res.status(SERVER_ERROR).send({ error: true, message: err });
    }
  },

  toggleDefault: async (req, res) => {
    const userId = req.userData.id;
    const id = req.body.id;
    console.log("Id is bla bla bla " + id);

    try {
      const data = await Address.find({ user: userId });

      for (var item of data) {
        const updatedData = {
          isDefault: false,
        };

        const options = { new: true };

        const result = await Address.findByIdAndUpdate(
          item.id,
          updatedData,
          options
        );
      }
      // Update individual address  below to True.
      const updatedData = {
        isDefault: true,
      };

      const options = { new: true };

      const result = await Address.findByIdAndUpdate(id, updatedData, options);

      return res.status(OK).send({ error: false });
    } catch (err) {
      return res.status(SERVER_ERROR).send({ error: true });
    }
  },
  findAllByUser: async (req, res) => {
    try {
      const userId = req.userData.id;
      const data = await Address.find({ user: userId }).sort({
        isDefault: -1,
      });

      return res.status(OK).send({ data: data });
    } catch (err) {
      return res.status(SERVER_ERROR).send({ error: true, message: err });
    }
  },

  delete: async (req, res) => {
    try {
      const id = req.params.id;
      const data = await Address.findByIdAndDelete(id);
      return res.status(OK).send({ error: false });
    } catch (err) {
      return res.status(SERVER_ERROR).send({ error: true, message: err });
    }
  },

  update: async (req, res) => {
    try {
      const id = req.params.id;

      const { address, postCode, isDefault } = req.body;
      const updatedData = {
        address: address,
        postCode: postCode,
        isDefault: isDefault,
      };

      const options = { new: true };

      const result = await Address.findByIdAndUpdate(id, updatedData, options);

      return res.status(OK).send({ error: false, result });
    } catch (err) {
      return res.status(SERVER_ERROR).send({ error: true, message: err });
    }
  },
};
