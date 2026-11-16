const crypto = require('crypto');
const { users } = require('../data/store');

// kullanıcıları getir
function listUsers(query = {}) {
  return users;
}
// ID ile kullanıcıyı getir
function getUserById(id) {
  const user = users.find((user) => user.id === id);

  if (!user) {
    const error = new Error('Kullanıcı bulunamadı.');
    error.statusCode = 404;
    throw error;
  }

  return user;
}
// Yeni kullanıcı oluştur
function createUser(data = {}) {
  if (!data.name || !data.surname) {
    const error = new Error('name ve surname alanları zorunludur.');
    error.statusCode = 400;
    throw error;
  }

  const user = {
    id: crypto.randomUUID(),
    name: data.name.trim(),
    surname: data.surname.trim(),
    tasks:[],
  };

  users.push(user);
  return user;
}
// Kullanıcıyı güncelle
function updateUser(id, data = {}) {
  const user = getUserById(id);
  deleteUser(id);

  if (data.name !== undefined) user.name = data.name.trim();
  if (data.surname !== undefined) user.surname = data.surname.trim();
  users.push(user);
  return user;
}
// Kullanıcıyı sil
function deleteUser(id) {
  const user = getUserById(id);
  users.splice(users.indexOf(user), 1);
  return user;
}

module.exports = {
  listUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
};
