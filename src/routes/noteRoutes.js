const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const noteController = require('../controllers/noteController');

const router = express.Router();

router.use(authMiddleware);

// CRUD Routes
router.post('/', noteController.createNote);
router.get('/', noteController.getNotes);
router.get('/:id', noteController.getNoteById);
router.put('/:id', noteController.updateNote);
router.delete('/:id', noteController.deleteNote);

module.exports = router;
