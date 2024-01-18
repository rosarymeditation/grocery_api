const controller = require("../controllers/transaction");
const { rootUrl } = require("../utility/constants");
const { auth, upload } = require("../utility/global");
module.exports = (app) => {
  app.post(
    rootUrl("transaction-create"),
    auth,

    controller.create
  );
  app.post(rootUrl("user-transactions"), auth, controller.userTotal);
  app.post(rootUrl("get-user-reward"), auth, controller.getUserReward);
  app.post(
    rootUrl("user-transactions-by-id"),
    auth,
    controller.userTransactionsById
  );
  app.post(rootUrl("stripe-payment"), controller.stripePayment);
};
