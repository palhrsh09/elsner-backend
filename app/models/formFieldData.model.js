  const mongoose = require("mongoose");

  const FormFieldDataSchema = new mongoose.Schema(
    {
      _id: { type: mongoose.Schema.Types.ObjectId, default: () => new mongoose.Types.ObjectId() },
      field_id: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'FormFields' }, 
    //   user_id: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Form' }, 
      value: { type: String,required: true},
      created_at: { type: Date, default: Date.now },
      updated_at: { type: Date, default: Date.now },
      status: { type: Boolean, default: true },
    },
    {
      collection: "FormFieldData",
      timestamps: false,
    }
  );

  module.exports = mongoose.model("FormFieldData", FormFieldDataSchema);
