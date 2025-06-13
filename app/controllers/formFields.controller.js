const formFieldsService = require("../services/formFields.service.js");

exports.getAllformFields = async (req, res) => {
  try {
    const formFields = await formFieldsService.getAllformFields({
      pageIndex: parseInt(req.query.pageIndex) || 1,
      pageSize: parseInt(req.query.pageSize) || null,
      sortOrder: req.query.sort?.order === "ASC" ? 1 : -1,
      sortKey: req.query.sort?.key || "created_at",
      query: req.query.query || "",
      showDeleted: req.query.showDeleted === "true",
    });
    res.status(200).json({ total: formFields.length, data: formFields });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getformFieldsById = async (req, res) => {
  try {
    const formFields = await formFieldsService.getformFieldsById(req.params.id);
    if (!formFields) return res.status(404).json({ message: "formFields not found" });
    res.status(200).json({ data: formFields });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createformFields = async (req, res) => {
  try {
    const formFields = await formFieldsService.createformFields(req.body);
    res.status(200).json({ data: formFields });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
exports.bulkCreateformFields = async (req, res) => {
  try {
    const formFields = await formFieldsService.bulkCreateformFields(req.body);
    res.status(200).json({ data: formFields });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateformFields = async (req, res) => {
  try {
    const formFields = await formFieldsService.updateformFields(req.params.id, req.body);
    if (!formFields) return res.status(404).json({ message: "formFields not found" });
    res.status(200).json({ data: formFields, isUpdated: true });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteformFields = async (req, res) => {
  try {
    const success = await formFieldsService.deleteformFields(req.params.id);
    if (!success) return res.status(404).json({ message: "formFields not found" });
    res.status(200).json({ data: success, isDeleted: true });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
