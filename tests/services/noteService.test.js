const Note = require('../../src/models/Note');
const noteService = require('../../src/services/noteService');

const originalMethods = {};

beforeEach(() => {
  originalMethods.create = Note.create;
  originalMethods.find = Note.find;
  originalMethods.countDocuments = Note.countDocuments;
  originalMethods.findOne = Note.findOne;
  originalMethods.findOneAndUpdate = Note.findOneAndUpdate;
});

afterEach(() => {
  Note.create = originalMethods.create;
  Note.find = originalMethods.find;
  Note.countDocuments = originalMethods.countDocuments;
  Note.findOne = originalMethods.findOne;
  Note.findOneAndUpdate = originalMethods.findOneAndUpdate;
});

it('createNote delegates to Note.create', async () => {
  const input = { title: 'Task', userId: 'u1' };
  const created = { _id: 'n1', ...input };

  Note.create = async (data) => {
    expect(data).toEqual(input);
    return created;
  };

  const result = await noteService.createNote(input);
  expect(result).toEqual(created);
});

it('getNotes builds filter, sorting and pagination', async () => {
  let capturedFilter;
  let capturedSort;
  let capturedSkip;
  let capturedLimit;
  const docs = [{ _id: 'n1' }, { _id: 'n2' }];

  Note.find = (filter) => {
    capturedFilter = filter;
    return {
      sort(sortObj) {
        capturedSort = sortObj;
        return this;
      },
      skip(skipValue) {
        capturedSkip = skipValue;
        return this;
      },
      limit(limitValue) {
        capturedLimit = limitValue;
        return Promise.resolve(docs);
      }
    };
  };

  Note.countDocuments = async (filter) => {
    expect(filter).toEqual(capturedFilter);
    return 12;
  };

  const result = await noteService.getNotes('u1', {
    page: '2',
    limit: '5',
    completed: 'true',
    priority: 'high',
    search: 'demo',
    sortBy: 'updatedAt',
    order: 'asc'
  });

  expect(capturedFilter).toEqual({
    userId: 'u1',
    isDeleted: false,
    completed: true,
    priority: 'high',
    $or: [
      { title: { $regex: 'demo', $options: 'i' } },
      { content: { $regex: 'demo', $options: 'i' } }
    ]
  });
  expect(capturedSort).toEqual({ updatedAt: 1 });
  expect(capturedSkip).toBe(5);
  expect(capturedLimit).toBe(5);
  expect(result).toEqual({
    total: 12,
    page: 2,
    limit: 5,
    notes: docs
  });
});

it('getNoteById queries scoped non-deleted note', async () => {
  const expected = { _id: 'n1', userId: 'u1' };

  Note.findOne = async (query) => {
    expect(query).toEqual({ _id: 'n1', userId: 'u1', isDeleted: false });
    return expected;
  };

  const result = await noteService.getNoteById('u1', 'n1');
  expect(result).toEqual(expected);
});

it('updateNote applies scoped update and returns new doc', async () => {
  const update = { title: 'Updated' };
  const expected = { _id: 'n1', ...update };

  Note.findOneAndUpdate = async (filter, data, options) => {
    expect(filter).toEqual({ _id: 'n1', userId: 'u1', isDeleted: false });
    expect(data).toEqual(update);
    expect(options).toEqual({ new: true });
    return expected;
  };

  const result = await noteService.updateNote('u1', 'n1', update);
  expect(result).toEqual(expected);
});

it('deleteNote performs soft delete', async () => {
  const expected = { _id: 'n1', isDeleted: true };

  Note.findOneAndUpdate = async (filter, data, options) => {
    expect(filter).toEqual({ _id: 'n1', userId: 'u1', isDeleted: false });
    expect(data).toEqual({ isDeleted: true });
    expect(options).toEqual({ new: true });
    return expected;
  };

  const result = await noteService.deleteNote('u1', 'n1');
  expect(result).toEqual(expected);
});
