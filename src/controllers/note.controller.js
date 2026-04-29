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

module.exports = {
  allowedSortFields,
  sendServerError,
  isValidObjectId,
  buildFilter,
  getSortOptions,
  getPaginationOptions,
  buildPagination,
  createNote,
};
