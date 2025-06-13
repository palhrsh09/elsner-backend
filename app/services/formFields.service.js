const db = require("../models");
const formFields = db.formFields;

exports.getAllformFields = async ({ pageIndex, pageSize, sortOrder, sortKey, query, showDeleted }) => {
  const sort = { [sortKey]: sortOrder };
  const filter = {}
  if (query) filter.value = { $regex: query, $options: "i" }; 
  if (!showDeleted) filter.status = true;
  let queryBuilder = formFields.find(filter).sort(sort);

  if (pageSize !== undefined && pageSize !== null) {
    const skip = (pageIndex - 1) * pageSize;
    queryBuilder = queryBuilder.skip(skip).limit(pageSize);
  }

  const data = await queryBuilder;
  return data;

};

exports.getformFieldsById = async (id) => {
  return await formFields.findById(id);
};

exports.createformFields = async (data) => {
  return await formFields.create(data);
};
exports.bulkCreateformFields = async (dataArray) => {
  return await formFields.insertMany(dataArray);
};

exports.updateformFields = async (id, data) => {
  return await formFields.findByIdAndUpdate(id, data, { new: true });
};

exports.deleteformFields = async (id) => {
  const result = await formFields.findByIdAndUpdate(id);
  return result !== null;
};
