const controller = require("../controllers/address");
const { rootUrl } = require("../utility/constants");
const { auth, upload } = require("../utility/global");
module.exports = (app) => {
  app.post(rootUrl("address/create"), auth, controller.create);
  app.post(rootUrl("address/byUser"), auth, controller.findAllByUser);
  app.post(rootUrl("address/toggle"), auth, controller.toggleDefault);
  app.delete(rootUrl("address/:id"), auth, controller.delete);
  app.patch(rootUrl("address/:id"), auth, controller.update);
};
