  const mongoose = require("mongoose");

  const FormFieldsSchema = new mongoose.Schema(
    {
      _id: { type: mongoose.Schema.Types.ObjectId, default: () => new mongoose.Types.ObjectId() },
      form_id: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Form', }, 
      type: {
        type: String,
        enum: ["TEXT", "CHECKBOX"],
        required: true,
      },
      title: { type: String,required: true},
      options: {
        type: [String],
        default: [],   
      },
      required: { type: Boolean, default: false },
      created_at: { type: Date, default: Date.now },
      updated_at: { type: Date, default: Date.now },
      status: { type: Boolean, default: true },
    },
    {
      collection: "FormFields",
      timestamps: false,
    }
  );

  module.exports = mongoose.model("FormFields", FormFieldsSchema);
