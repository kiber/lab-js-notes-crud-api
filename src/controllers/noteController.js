const noteService = require('../services/noteService');

class NoteController {

  async createNote(req, res) {
    try {
      const note = await noteService.createNote({
        ...req.body,
        userId: req.userId
      });

      res.status(201).json(note);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async getNotes(req, res) {
    try {
      const result = await noteService.getNotes(req.userId, req.query);
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async getNoteById(req, res) {
    try {
      const note = await noteService.getNoteById(req.userId, req.params.id);

      if (!note) {
        return res.status(404).json({ message: 'Note not found' });
      }

      res.status(200).json(note);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async updateNote(req, res) {
    try {
      const updated = await noteService.updateNote(
        req.userId,
        req.params.id,
        req.body
      );

      if (!updated) {
        return res.status(404).json({ message: 'Note not found' });
      }

      res.status(200).json(updated);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async deleteNote(req, res) {
    try {
      const deleted = await noteService.deleteNote(
        req.userId,
        req.params.id
      );

      if (!deleted) {
        return res.status(404).json({ message: 'Note not found' });
      }

      res.status(200).json({ message: 'Note deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
}

module.exports = new NoteController();
