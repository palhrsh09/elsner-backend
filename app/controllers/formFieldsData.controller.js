const formFieldsDataService = require("../services/formFieldsData.service.js");

exports.getAllformFieldsData = async (req, res) => {
  try {
    const formFieldsData = await formFieldsDataService.getAllformFieldsData({
      pageIndex: parseInt(req.query.pageIndex) || 1,
      pageSize: parseInt(req.query.pageSize) || null,
      sortOrder: req.query.sort?.order === "ASC" ? 1 : -1,
      sortKey: req.query.sort?.key || "created_at",
      query: req.query.query || "",
      showDeleted: req.query.showDeleted === "true",
    });
    res.status(200).json({ total: formFieldsData.length, data: formFieldsData });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getformFieldsDataById = async (req, res) => {
  try {
    const formFieldsData = await formFieldsDataService.getformFieldsDataById(req.params.id);
    if (!formFieldsData) return res.status(404).json({ message: "formFieldsData not found" });
    res.status(200).json({ data: formFieldsData });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createformFieldsData = async (req, res) => {
  try {
    const formFieldsData = await formFieldsDataService.createformFieldsData(req.body);
    res.status(200).json({ data: formFieldsData });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.bulkCreateformFieldsData = async (req, res) => {
  try {
    const formFieldsData = await formFieldsDataService.bulkCreateformFieldsData(req.body);
    res.status(200).json({ success: true, data: formFieldsData });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


exports.updateformFieldsData = async (req, res) => {
  try {
    const formFieldsData = await formFieldsDataService.updateformFieldsData(req.params.id, req.body);
    if (!formFieldsData) return res.status(404).json({ message: "formFieldsData not found" });
    res.status(200).json({ data: formFieldsData, isUpdated: true });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteformFieldsData = async (req, res) => {
  try {
    const success = await formFieldsDataService.deleteformFieldsData(req.params.id);
    if (!success) return res.status(404).json({ message: "formFieldsData not found" });
    res.status(200).json({ data: success, isDeleted: true });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
