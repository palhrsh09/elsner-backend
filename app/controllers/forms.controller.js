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
    const { title, description } = req.body;
    if (!title || typeof title !== "string" || !title.trim()) {
      return res.status(400).json({ message: "Title is required and must be a non-empty string" });
    }
    const forms = await formsService.createForms({
      title: title.trim(),
      description: description?.trim() || null,
    });

    res.status(200).json({ data: forms });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateforms = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid form ID" });
    }

    const { title, description } = req.body;

    if (title && (!title.trim() || typeof title !== "string")) {
      return res.status(400).json({ message: "Title must be a non-empty string" });
    }

    const forms = await formsService.updateForms(id, {
      ...(title && { title: title.trim() }),
      ...(description !== undefined && { description: description?.trim() || null }),
    });

    if (!forms) return res.status(404).json({ message: "Form not found" });

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
