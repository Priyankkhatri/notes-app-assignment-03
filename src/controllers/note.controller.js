const mongoose = require("mongoose");
const Note = require("../models/note.model");

const allowedSortFields = ["title", "createdAt", "updatedAt", "category"];

const sendServerError = (res, error) =>
  res.status(500).json({
    success: false,
    message: error.message,
    data: null,
  });

const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

const buildFilter = ({ q, category, isPinned, searchMode = null }) => {
  const filter = {};

  if (q) {
    if (searchMode === "title") {
      filter.title = { $regex: q, $options: "i" };
    } else if (searchMode === "content") {
      filter.content = { $regex: q, $options: "i" };
    } else {
      filter.$or = [
        { title: { $regex: q, $options: "i" } },
        { content: { $regex: q, $options: "i" } },
      ];
    }
  }

  if (category) {
    filter.category = category;
  }

  if (isPinned !== undefined) {
    filter.isPinned = isPinned === "true";
  }

  return filter;
};

const getSortOptions = (sortBy, order) => {
  const sortField = allowedSortFields.includes(sortBy) ? sortBy : "createdAt";
  const sortOrder = order === "asc" ? 1 : -1;

  return { [sortField]: sortOrder };
};

const getPaginationOptions = (page, limit) => {
  const pageNum = parseInt(page, 10) || 1;
  const limitNum = parseInt(limit, 10) || 10;
  const skip = (pageNum - 1) * limitNum;

  return { pageNum, limitNum, skip };
};

const buildPagination = (total, pageNum, limitNum) => {
  const totalPages = Math.ceil(total / limitNum);

  return {
    total,
    page: pageNum,
    limit: limitNum,
    totalPages,
    hasNextPage: pageNum < totalPages,
    hasPrevPage: pageNum > 1,
  };
};

const createNote = async (req, res) => {
  try {
    const { title, content, category, isPinned } = req.body;

    if (!title || !content) {
      return res.status(400).json({
        success: false,
        message: "Title and content are required",
        data: null,
      });
    }

    const note = await Note.create({ title, content, category, isPinned });

    return res.status(201).json({
      success: true,
      message: "Note created successfully",
      data: note,
    });
  } catch (error) {
    return sendServerError(res, error);
  }
};

const createBulkNotes = async (req, res) => {
  try {
    const { notes } = req.body;

    if (!Array.isArray(notes) || notes.length === 0) {
      return res.status(400).json({
        success: false,
        message: "notes array is required and cannot be empty",
        data: null,
      });
    }

    const createdNotes = await Note.insertMany(notes);

    return res.status(201).json({
      success: true,
      message: `${createdNotes.length} notes created successfully`,
      data: createdNotes,
    });
  } catch (error) {
    return sendServerError(res, error);
  }
};

const getAllNotes = async (req, res) => {
  try {
    const notes = await Note.find();

    return res.status(200).json({
      success: true,
      message: "Notes fetched successfully",
      count: notes.length,
      data: notes,
    });
  } catch (error) {
    return sendServerError(res, error);
  }
};

const getNoteById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid note ID",
        data: null,
      });
    }

    const note = await Note.findById(id);

    if (!note) {
      return res.status(404).json({
        success: false,
        message: "Note not found",
        data: null,
      });
    }

    return res.status(200).json({
      success: true,
      message: "Note fetched successfully",
      data: note,
    });
  } catch (error) {
    return sendServerError(res, error);
  }
};

const replaceNote = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid note ID",
        data: null,
      });
    }

    const note = await Note.findByIdAndUpdate(id, req.body, {
      new: true,
      overwrite: true,
      runValidators: true,
    });

    if (!note) {
      return res.status(404).json({
        success: false,
        message: "Note not found",
        data: null,
      });
    }

    return res.status(200).json({
      success: true,
      message: "Note replaced successfully",
      data: note,
    });
  } catch (error) {
    return sendServerError(res, error);
  }
};

const updateNote = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid note ID",
        data: null,
      });
    }

    if (Object.keys(req.body).length === 0) {
      return res.status(400).json({
        success: false,
        message: "No fields provided to update",
        data: null,
      });
    }

    const note = await Note.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!note) {
      return res.status(404).json({
        success: false,
        message: "Note not found",
        data: null,
      });
    }

    return res.status(200).json({
      success: true,
      message: "Note updated successfully",
      data: note,
    });
  } catch (error) {
    return sendServerError(res, error);
  }
};

const deleteNote = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid note ID",
        data: null,
      });
    }

    const note = await Note.findByIdAndDelete(id);

    if (!note) {
      return res.status(404).json({
        success: false,
        message: "Note not found",
        data: null,
      });
    }

    return res.status(200).json({
      success: true,
      message: "Note deleted successfully",
      data: null,
    });
  } catch (error) {
    return sendServerError(res, error);
  }
};

const deleteBulkNotes = async (req, res) => {
  try {
    const { ids } = req.body;

    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({
        success: false,
        message: "ids array is required and cannot be empty",
        data: null,
      });
    }

    const result = await Note.deleteMany({ _id: { $in: ids } });

    return res.status(200).json({
      success: true,
      message: `${result.deletedCount} notes deleted successfully`,
      data: null,
    });
  } catch (error) {
    return sendServerError(res, error);
  }
};

const searchByTitle = async (req, res) => {
  try {
    const { q } = req.query;

    if (!q) {
      return res.status(400).json({
        success: false,
        message: "Search query 'q' is required",
        data: null,
      });
    }

    const notes = await Note.find(buildFilter({ q, searchMode: "title" }));

    return res.status(200).json({
      success: true,
      message: `Search results for: ${q}`,
      count: notes.length,
      data: notes,
    });
  } catch (error) {
    return sendServerError(res, error);
  }
};

const searchByContent = async (req, res) => {
  try {
    const { q } = req.query;

    if (!q) {
      return res.status(400).json({
        success: false,
        message: "Search query 'q' is required",
        data: null,
      });
    }

    const notes = await Note.find(buildFilter({ q, searchMode: "content" }));

    return res.status(200).json({
      success: true,
      message: `Content search results for: ${q}`,
      count: notes.length,
      data: notes,
    });
  } catch (error) {
    return sendServerError(res, error);
  }
};

const searchAll = async (req, res) => {
  try {
    const { q } = req.query;

    if (!q) {
      return res.status(400).json({
        success: false,
        message: "Search query 'q' is required",
        data: null,
      });
    }

    const notes = await Note.find(buildFilter({ q }));

    return res.status(200).json({
      success: true,
      message: `Search results for: ${q}`,
      count: notes.length,
      data: notes,
    });
  } catch (error) {
    return sendServerError(res, error);
  }
};

const filterAndSort = async (req, res) => {
  try {
    const { category, isPinned, sortBy, order } = req.query;
    const notes = await Note.find(buildFilter({ category, isPinned })).sort(
      getSortOptions(sortBy, order)
    );

    return res.status(200).json({
      success: true,
      message: "Notes fetched successfully",
      count: notes.length,
      data: notes,
    });
  } catch (error) {
    return sendServerError(res, error);
  }
};

const filterAndPaginate = async (req, res) => {
  try {
    const { category, isPinned, page, limit } = req.query;
    const filter = buildFilter({ category, isPinned });
    const { pageNum, limitNum, skip } = getPaginationOptions(page, limit);
    const total = await Note.countDocuments(filter);
    const notes = await Note.find(filter).skip(skip).limit(limitNum);

    return res.status(200).json({
      success: true,
      message: "Notes fetched successfully",
      data: notes,
      pagination: buildPagination(total, pageNum, limitNum),
    });
  } catch (error) {
    return sendServerError(res, error);
  }
};

const sortAndPaginate = async (req, res) => {
  try {
    const { sortBy, order, page, limit } = req.query;
    const { pageNum, limitNum, skip } = getPaginationOptions(page, limit);
    const total = await Note.countDocuments();
    const notes = await Note.find()
      .sort(getSortOptions(sortBy, order))
      .skip(skip)
      .limit(limitNum);

    return res.status(200).json({
      success: true,
      message: "Notes fetched successfully",
      data: notes,
      pagination: buildPagination(total, pageNum, limitNum),
    });
  } catch (error) {
    return sendServerError(res, error);
  }
};

module.exports = {
  allowedSortFields,
  sendServerError,
  isValidObjectId,
  buildFilter,
  getSortOptions,
  getPaginationOptions,
  buildPagination,
  createNote,
  createBulkNotes,
  getAllNotes,
  getNoteById,
  replaceNote,
  updateNote,
  deleteNote,
  deleteBulkNotes,
  searchByTitle,
  searchByContent,
  searchAll,
  filterAndSort,
  filterAndPaginate,
  sortAndPaginate,
};
