const controller = require("../controllers/product");
const { rootUrl } = require("../utility/constants");
const { auth, upload } = require("../utility/global");
module.exports = (app) => {
  app.post(
    rootUrl("product/create"),
    upload.single("image"),

    controller.create
  );
  app.post(rootUrl("manipulate"), controller.manipulate);
  app.post(rootUrl("product/all"), controller.findAll);
  app.post(rootUrl("productsByCategory"), controller.findAllByCategory);
  app.post(rootUrl("product/findById"), controller.findById);
  app.delete(rootUrl("product/:id"), controller.delete);
  app.patch(
    rootUrl("product/:id"),
    upload.single("image"),

    controller.update
  );

  //   app.get(rootUrl("categories"), controller.findAll);

  //   app.post(rootUrl("categoriesByPopular"), controller.findByPopular);
  //   app.post(rootUrl("findCategorySearch"), controller.findCategorySearch);
  //   app.post(rootUrl("categoriesByShop"), controller.findByShop);
  //   app.post(rootUrl("findCategoryByShopUrl"), controller.findCategoryByShopUrl);
  //   //findCategoryByShopUrl
  //   app.post(
  //     rootUrl("allCategoriesForMobile"),
  //     controller.findAllCategoriesForMobile
  //   );

  //   app.get(rootUrl("categoriesLighter"), controller.findAllLighter);

  //   app.get(rootUrl("category/display"), controller.display);

  //   app.get(rootUrl("category/:id"), controller.findPk);

  //   app.patch(rootUrl("category/:id"), controller.update);

  //   app.delete(rootUrl("category/:id"), controller.delete);
};
