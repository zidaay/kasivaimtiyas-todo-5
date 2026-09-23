import { Request, Response } from 'express';
import { TodoModel } from '../models/todoModel.js';

export const getTodos = async (req: Request, res: Response): Promise<void> => {
  const userId = res.locals.userId;

  try {
    const todos = await TodoModel.getByUserId(userId);
    res.status(200).json({ success: true, data: todos });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Gagal mengambil data.' });
  }
};

// GET /api/todos/:id — Ambil satu todo berdasarkan ID
export const getTodoById = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const userId = res.locals.userId;
    try {
        const todo = await TodoModel.getById(Number(id), userId);

        if (!todo) {
            res.status(404).json({ success: false, message: 'Tugas tidak ditemukan!' });
            return;
        }

        res.status(200).json({ success: true, data: todo });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Gagal mengambil data.' });
    }
};

export const createTodo = async (req: Request, res: Response): Promise<void> => {
  const { task } = req.body;
  const userId = res.locals.userId;

  try {
    const newId = await TodoModel.create(userId, task);
    res.status(201).json({
      success: true,
      message: 'Tugas berhasil ditambahkan.',
      data: { id: newId, task, is_completed: false }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Gagal menambahkan tugas.' });
  }
};

export const updateTodo = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const { task, is_completed: isCompleted } = req.body;
  const userId = res.locals.userId;

  try {
    const existingTodo = await TodoModel.getById(Number(id), userId);

    if (!existingTodo) {
      res.status(404).json({ success: false, message: 'Tugas tidak ditemukan!' });
      return;
    }

    const updatedTask = task ?? existingTodo.task;
    const updatedIsCompleted = isCompleted ?? Boolean(existingTodo.is_completed);
    const affectedRows = await TodoModel.update(
      Number(id),
      updatedTask,
      updatedIsCompleted,
      userId
    );

    res.status(200).json({
      success: true,
      message: 'Tugas berhasil diperbarui.',
      data: { id: Number(id), task: updatedTask, is_completed: updatedIsCompleted },
      affectedRows
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Gagal memperbarui tugas.' });
  }
};

export const deleteTodo = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const userId = res.locals.userId;

  try {
    const affectedRows = await TodoModel.delete(Number(id), userId);

    if (!affectedRows) {
      res.status(404).json({ success: false, message: 'Tugas tidak ditemukan!' });
      return;
    }

    res.status(200).json({ success: true, message: 'Tugas berhasil dihapus.' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Gagal menghapus tugas.' });
  }
};