const formsService = require("../services/forms.service.js");

exports.getAllforms = async (req, res) => {
  try {
    const forms = await formsService.getAllForms({
      pageIndex: parseInt(req.query.pageIndex) || 1,
      pageSize: parseInt(req.query.pageSize) || null,
      sortOrder: req.query.sort?.order === "ASC" ? 1 : -1,
      sortKey: req.query.sort?.key || "created_at",
      query: req.query.query || "",
      showDeleted: req.query.showDeleted === "true",
    });
    res.status(200).json({ total: forms.length, data: forms });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getformsById = async (req, res) => {
  try {
    const forms = await formsService.getFormsById(req.params.id);
    if (!forms) return res.status(404).json({ message: "forms not found" });
    res.status(200).json({ data: forms });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createforms = async (req, res) => {
  try {
    const forms = await formsService.createForms(req.body);
    res.status(200).json({ data: forms });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateforms = async (req, res) => {
  try {
    const forms = await formsService.updateForms(req.params.id, req.body);
    if (!forms) return res.status(404).json({ message: "forms not found" });
    res.status(200).json({ data: forms, isUpdated: true });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteforms = async (req, res) => {
  try {
    const success = await formsService.deleteForms(req.params.id);
    if (!success) return res.status(404).json({ message: "forms not found" });
    res.status(200).json({ data: success, isDeleted: true });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
