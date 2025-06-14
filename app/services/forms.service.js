const db = require("../models");
const Forms = db.forms;
const FormFieldData = db.formFieldsData
const mongoose = require("mongoose")

exports.getAllForms = async ({ pageIndex, pageSize, sortOrder, sortKey, query, showDeleted }) => {
  const sort = { [sortKey]: sortOrder };
  const filter = {}
  if (query) filter.value = { $regex: query, $options: "i" }; 
  if (!showDeleted) filter.status = true;
  let queryBuilder = Forms.find(filter).sort(sort);

  if (pageSize !== undefined && pageSize !== null) {
    const skip = (pageIndex - 1) * pageSize;
    queryBuilder = queryBuilder.skip(skip).limit(pageSize);
  }

  const data = await queryBuilder;
  return data;

};

exports.getFormsById = async (id) => {
  const formId = new mongoose.Types.ObjectId(id);

  const result = await Forms.aggregate([
    { $match: { _id: formId } },
    {
      $lookup: {
        from: "FormFields",
        localField: "_id",
        foreignField: "form_id",
        as: "fields"
      }
    },
    {
      $project: {
        _id: 1,
        title: 1,
        description: 1,
        status: 1,
        fields: {
          _id: 1,
          title: 1,
          type: 1,
          options: 1,
          required: 1
        }
      }
    }
  ]);

  if (!result.length) {
    throw new Error("Form not found");
  }

  return result[0]; 
};

exports.getFormsByIdWithData = async (formId) => {
  const objectId = new mongoose.Types.ObjectId(formId);

  const form = await Forms.findById(objectId, "title description").lean();
  if (!form) throw new Error("Form not found");

  const result = await FormFieldData.aggregate([
    {
      $lookup: {
        from: "FormFields",
        localField: "field_id",
        foreignField: "_id",
        as: "fieldInfo"
      }
    },
    { $unwind: "$fieldInfo" },
    {
      $match: {
        "fieldInfo.form_id": objectId
      }
    },
    {
      $group: {
        _id: "$user_id",
        responses: {
          $push: {
            field_id: "$field_id",
            title: "$fieldInfo.title",
            type: "$fieldInfo.type",
            value: "$value"
          }
        }
      }
    }
  ]);

  return {
    formTitle: form.title,
    formDescription: form.description,
    data: result
  };
};


exports.createForms = async (data) => {
  return await Forms.create(data);
};

exports.updateForms = async (id, data) => {
  return await Forms.findByIdAndUpdate(id, data, { new: true });
};

exports.deleteForms = async (id) => {
  const result = await Forms.findByIdAndUpdate(id);
  return result !== null;
};
