import createHttpError from 'http-errors';
import Note from '../models/note.js';

export const getAllNotes = async (req, res, next) => {
  try {
    const {
      page = 1,
      perPage = 10,
      tag,
      search = "",
    } = req.query;

    const myQuery = Note.find();

    if (tag) {
      myQuery.where({ tag });
    }

    if (search) {
      myQuery.where({
        $or: [
          {
            title: {
              $regex: search,
              $options: "i",
            },
          },
          {
            content: {
              $regex: search,
              $options: "i",
            },
          },
        ],
      });
    }

    const totalNotes = await Note.countDocuments(myQuery.getFilter());

    const totalPages = Math.ceil(totalNotes / perPage);

    const notes = await myQuery
      .skip((page - 1) * perPage)
      .limit(perPage);

    res.status(200).json({
      page,
      perPage,
      totalNotes,
      totalPages,
      notes,
    });
  } catch (error) {
    next(error);
  }
};


export const getNoteById = async (req, res) => {
  const { noteId } = req.params;

  const note = await Note.findById(noteId);

  if (!note) {
    throw createHttpError(404, 'Note not found');
  }

  res.status(200).json(note);
};

export const createNote = async (req, res) => {
  const note = await Note.create(req.body);

  res.status(201).json(note);
};

export const deleteNote = async (req, res) => {
  const { noteId } = req.params;

  const note = await Note.findByIdAndDelete(noteId);

  if (!note) {
    throw createHttpError(404, 'Note not found');
  }

  res.status(200).json(note);
};

export const updateNote = async (req, res) => {
  const { noteId } = req.params;

  const note = await Note.findByIdAndUpdate(
    noteId,
    req.body,
    {
      returnDocument: 'after'
    },
  );

  if (!note) {
    throw createHttpError(404, 'Note not found');
  }

  res.status(200).json(note);
};