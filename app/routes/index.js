module.exports = (app, express) => {
  const router = express.Router();

  router.use("/v1/forms", require("./forms.routes"));
  router.use("/v1/form-fields", require("./formFields.routes"));
  router.use("/v1/form-fields-data", require("./formFieldsData.routes"));
  app.use("/form" ,router);
};
