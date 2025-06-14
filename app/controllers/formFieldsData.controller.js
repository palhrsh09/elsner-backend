const formFieldsDataService = require("../services/formFieldsData.service.js");
const mongoose = require("mongoose")
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
    const { field_id, value } = req.body;

    if (!mongoose.Types.ObjectId.isValid(field_id)) {
      return res.status(400).json({ message: "Invalid field_id" });
    }

    if (!value || typeof value !== "string" || !value.trim()) {
      return res.status(400).json({ message: "Value is required and must be a non-empty string" });
    }

    const formFieldsData = await formFieldsDataService.createformFieldsData({
      field_id,
      value: value.trim(),
    });

    res.status(200).json({ data: formFieldsData });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


exports.bulkCreateformFieldsData = async (req, res) => {
  try {
    const data = req.body;

    if (!Array.isArray(data) || data.length === 0) {
      return res.status(400).json({ message: "Payload must be a non-empty array" });
    }
    const user_id = new mongoose.Types.ObjectId();
    const filteredData = data.filter(item => 
      mongoose.Types.ObjectId.isValid(item.field_id) &&
      typeof item.value === "string" &&
      item.value.trim() !== ""
    );

    if (filteredData.length === 0) {
      return res.status(400).json({ message: "No valid form field data found in the payload" });
    }

    const cleanedPayload = filteredData.map(item => ({
      field_id: item.field_id,
      value: item.value.trim(),
      user_id 
    }));

    const formFieldsData = await formFieldsDataService.bulkCreateformFieldsData(cleanedPayload);

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
