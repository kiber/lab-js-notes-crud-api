const Note = require('../models/Note');

class NoteService {

  async createNote(data) {
    return await Note.create(data);
  }

  async getNotes(userId, queryParams) {
    const {
      page = 1,
      limit = 10,
      completed,
      priority,
      search,
      sortBy = 'createdAt',
      order = 'desc'
    } = queryParams;

    const filter = {
      userId,
      isDeleted: false
    };

    if (completed !== undefined) {
      filter.completed = completed === 'true';
    }

    if (priority) {
      filter.priority = priority;
    }

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } }
      ];
    }

    const skip = (page - 1) * limit;

    const notes = await Note.find(filter)
      .sort({ [sortBy]: order === 'asc' ? 1 : -1 })
      .skip(Number(skip))
      .limit(Number(limit));

    const total = await Note.countDocuments(filter);

    return {
      total,
      page: Number(page),
      limit: Number(limit),
      notes
    };
  }

  async getNoteById(userId, noteId) {
    return await Note.findOne({
      _id: noteId,
      userId,
      isDeleted: false
    });
  }

  async updateNote(userId, noteId, updateData) {
    return await Note.findOneAndUpdate(
      { _id: noteId, userId, isDeleted: false },
      updateData,
      { new: true }
    );
  }

  async deleteNote(userId, noteId) {
    return await Note.findOneAndUpdate(
      { _id: noteId, userId, isDeleted: false },
      { isDeleted: true },
      { new: true }
    );
  }
}

module.exports = new NoteService();
