const db = require("../models");
const formFieldsData = db.formFieldsData;

exports.getAllformFieldsData = async ({ pageIndex, pageSize, sortOrder, sortKey, query, showDeleted }) => {
  const sort = { [sortKey]: sortOrder };
  const filter = {}
  if (query) filter.value = { $regex: query, $options: "i" }; 
  if (!showDeleted) filter.status = true;
  let queryBuilder = formFieldsData.find(filter).sort(sort);

  if (pageSize !== undefined && pageSize !== null) {
    const skip = (pageIndex - 1) * pageSize;
    queryBuilder = queryBuilder.skip(skip).limit(pageSize);
  }

  const data = await queryBuilder;
  return data;

};

exports.getformFieldsDataById = async (id) => {
  return await formFieldsData.findById(id);
};

exports.bulkCreateformFieldsData = async (dataArray) => {
  return await formFieldsData.insertMany(dataArray);
};


exports.updateformFieldsData = async (id, data) => {
  return await formFieldsData.findByIdAndUpdate(id, data, { new: true });
};

exports.deleteformFieldsData = async (id) => {
  const result = await formFieldsData.findByIdAndUpdate(id);
  return result !== null;
};
