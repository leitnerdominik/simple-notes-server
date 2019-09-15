const Note = require('../models/note');
const User = require('../models/user');

exports.createNote = async (req, res, next) => {
  const { userId } = req;
  const { title, body } = req.body;

  try {
    const createdNote = new Note({
      title,
      body,
      creator: req.userId,
    });

    const newNote = await createdNote.save();
    const user = await User.findById(userId);
    user.notes.push(newNote);
    await user.save();

    res.status(201).json({ message: 'Note created!', note: newNote });
  } catch (err) {
    console.log(err);
    next(err);
  }
};

exports.getNotes = async (req, res, next) => {
  const { userId } = req;

  try {
    const notes = await Note.find({ creator: userId.toString() });
    res.status(200).json({ message: 'Fetched Notes!', notes });
  } catch (err) {
    console.log(err);
    next(err);
  }
};

exports.updateNote = async (req, res, next) => {
  const { title, body, id } = req.body;

  try {
    const currentNote = await Note.findById(id).populate('creator');
    currentNote.title = title;
    currentNote.body = body;
    const result = await currentNote.save();
    res.status(200).json({ message: 'Note saved!', note: result });
  } catch (err) {
    console.log(err);
    next(err);
  }
};
