const noteService = require('../services/noteService');
const { sendSuccess, sendError } = require('../utils/response');

class NoteController {

  async createNote(req, res) {
    try {
      const note = await noteService.createNote({
        ...req.body,
        userId: req.userId
      });

      return sendSuccess(res, {
        statusCode: 201,
        message: 'Note created successfully',
        data: note
      });
    } catch (error) {
      return sendError(res, {
        statusCode: 500,
        message: 'Failed to create note',
        error: error.message
      });
    }
  }

  async getNotes(req, res) {
    try {
      const result = await noteService.getNotes(req.userId, req.query);
      return sendSuccess(res, {
        statusCode: 200,
        message: 'Notes fetched successfully',
        data: result.notes,
        meta: {
          total: result.total,
          page: result.page,
          limit: result.limit
        }
      });
    } catch (error) {
      return sendError(res, {
        statusCode: 500,
        message: 'Failed to fetch notes',
        error: error.message
      });
    }
  }

  async getNoteById(req, res) {
    try {
      const note = await noteService.getNoteById(req.userId, req.params.id);

      if (!note) {
        return sendError(res, {
          statusCode: 404,
          message: 'Note not found'
        });
      }

      return sendSuccess(res, {
        statusCode: 200,
        message: 'Note fetched successfully',
        data: note
      });
    } catch (error) {
      return sendError(res, {
        statusCode: 500,
        message: 'Failed to fetch note',
        error: error.message
      });
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
        return sendError(res, {
          statusCode: 404,
          message: 'Note not found'
        });
      }

      return sendSuccess(res, {
        statusCode: 200,
        message: 'Note updated successfully',
        data: updated
      });
    } catch (error) {
      return sendError(res, {
        statusCode: 500,
        message: 'Failed to update note',
        error: error.message
      });
    }
  }

  async deleteNote(req, res) {
    try {
      const deleted = await noteService.deleteNote(
        req.userId,
        req.params.id
      );

      if (!deleted) {
        return sendError(res, {
          statusCode: 404,
          message: 'Note not found'
        });
      }

      return sendSuccess(res, {
        statusCode: 200,
        message: 'Note deleted successfully',
        data: {
          id: req.params.id
        }
      });
    } catch (error) {
      return sendError(res, {
        statusCode: 500,
        message: 'Failed to delete note',
        error: error.message
      });
    }
  }
}

module.exports = new NoteController();
