const express = require('express');

const isAuth = require('../middleware/isAuth');

const noteController = require('../controllers/notes');
const router = express.Router();

router.get('/notes', isAuth, noteController.getNotes)
router.put('/createNote', isAuth, noteController.createNote);
router.patch('/updateNote', isAuth, noteController.updateNote);
router.delete('/deleteNote/:noteId', isAuth, noteController.deleteNote);

module.exports = router;