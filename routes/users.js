const express = require('express');
const users = require('../operations/users');

const router = express.Router();

router.get('/', (req, res) => {
  res.json(users.listUsers(req.query));
});

router.get('/:id', (req, res) => {
  res.json(users.getUserById(req.params.id));
});

router.post('/', (req, res) => {
  res.status(201).json(users.createUser(req.body));
});

router.put('/:id', (req, res) => {
  res.json(users.updateUser(req.params.id, req.body));
});

router.delete('/:id', (req, res) => {
  users.deleteUser(req.params.id);
  res.status(204).send();
});

module.exports = router;
