const express = require('express');
const tasks = require('../operations/tasks');

const router = express.Router();

router.get('/', (req, res) => {
  res.json(tasks.listTasks(req.query));
});

// GET /tasks/assignee/Musa
router.get('/assignee/:userName', (req, res) => {
  res.json(tasks.listTasksByAssigneeName(req.params.userName));
});

router.get('/:id', (req, res) => {
  res.json(tasks.getTaskById(req.params.id));
});

router.post('/', (req, res) => {
  res.status(201).json(tasks.createTask(req.body));
});

router.put('/:id', (req, res) => {
  res.json(tasks.updateTask(req.params.id, req.body));
});

router.delete('/:id', (req, res) => {
  tasks.deleteTask(req.params.id);
  res.status(204).send();
});

router.post('/:taskId/assign/:userId', (req, res) => {
  const { taskId, userId } = req.params;
  tasks.assignTaskToUser(taskId, userId);
  res.status(200).json({ message: 'Görev başarıyla kullanıcıya atandı.' });
});

router.post('/:taskId/complete', (req, res) => {
  const { taskId } = req.params;
  tasks.completeTask(taskId);
  res.status(200).json({ message: 'Görev başarıyla tamamlandı.' });
});
router.post('/:taskId/progress', (req, res) => {
  const { taskId } = req.params;
  tasks.progressTask(taskId, 'in-progress');
  res.status(200).json({ message: 'Görev ilerleme durumu güncellendi.' });
});

module.exports = router;
