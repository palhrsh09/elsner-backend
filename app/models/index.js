const mongoose = require("mongoose");

const db = {};
db.mongoose = mongoose;
db.forms = require("./forms.model.js");
db.formFields = require("./formFields.model.js");
db.formFieldsData = require("./formFieldData.model.js");

module.exports = db;
