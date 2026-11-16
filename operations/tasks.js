const crypto = require('crypto');
const { tasks } = require('../data/store');
const users = require('./users');

const statuses = ['pending', 'in-progress', 'completed'];
const priorities = ['low', 'medium', 'high'];
// Durum, öncelik veya kullanıcıya göre görevleri filtrele.
function filterTasks(taskList, filters = {}) {
  return taskList.filter((task) => {
    const matchesStatus = !filters.status || task.status === filters.status;
    const matchesPriority = !filters.priority || task.priority === filters.priority;
    const matchesUser = !filters.userId || task.userId === filters.userId;

    return matchesStatus && matchesPriority && matchesUser;
  });
}

// Görev başlığı ve açıklaması içinde arama yap.
function searchTasks(taskList, keyword) {
  const normalizedKeyword = String(keyword || '').trim().toLocaleLowerCase('tr-TR');

  if (!normalizedKeyword) return taskList;

  return taskList.filter((task) => {
    const searchableText = `${task.title} ${task.description}`.toLocaleLowerCase('tr-TR');
    return searchableText.includes(normalizedKeyword);
  });
}

// Sonuçları sayfalara böl.
function paginateTasks(taskList, page = 1, limit = 10) {
  const currentPage = Number.parseInt(page, 10) || 1;
  const pageSize = Number.parseInt(limit, 10) || 10;

  if (currentPage < 1 || pageSize < 1 || pageSize > 100) {
    const error = new Error('page 1 veya daha büyük, limit 1-100 arasında olmalıdır.');
    error.statusCode = 400;
    throw error;
  }

  const startIndex = (currentPage - 1) * pageSize;

  return {
    data: taskList.slice(startIndex, startIndex + pageSize),
  };
}

// Query parametreleri varsa filtreleme, arama ve sayfalama uygula.
function listTasks(query = {}) {
  let result = filterTasks(tasks, query);
  result = searchTasks(result, query.keyword);

  if (query.page !== undefined || query.limit !== undefined) {
    return paginateTasks(result, query.page, query.limit);
  }

  return result;
}

// Kullanıcı adına göre atanmış görevleri getir.
function listTasksByAssigneeName(userName) {
  const normalizedName = decodeURIComponent(String(userName || ''))
    .trim()
    .toLocaleLowerCase('tr-TR');
  const user = users.listUsers().find(
    (item) => item.name.toLocaleLowerCase('tr-TR') === normalizedName
  );

  if (!user) {
    const error = new Error('Kullanıcı bulunamadı.');
    error.statusCode = 404;
    throw error;
  }

  return tasks.filter((task) => task.userId === user.id);
}
// ID ile görevi getir
function getTaskById(id) {
  const task = tasks.find((task) => task.id === id);

  if (!task) {
    const error = new Error('Görev bulunamadı.');
    error.statusCode = 404;
    throw error;
  }

  return task;
}
// Görevi doğrula
function validateTask(data) {
  if (!data.title || !data.description) {
    const error = new Error('title , description ve priority alanı zorunludur.');
    error.statusCode = 400;
    throw error;
  }

  if (data.priority && !priorities.includes(data.priority)) {
    const error = new Error(`priority şu değerlerden biri olmalıdır: ${priorities.join(', ')}.`);
    error.statusCode = 400;
    throw error;
  }
}
// Yeni görev oluştur
function createTask(data = {}) {
  validateTask(data);

  const task = {
    id: crypto.randomUUID(),
    title: data.title.trim(),
    description: data.description.trim(),
    userId:0,
    status:'pending',
    priority: data.priority,
    createdAt: new Date().toISOString()
  };

  tasks.push(task);
  return task;
}
// Görevi güncelle
function updateTask(id, data = {}) {
  const task = getTaskById(id);
  validateTask({ ...task, ...data });

  Object.assign(task, {
    ...data
  });

  return task;
}
// Görevi sil
function deleteTask(id) {
  const task = getTaskById(id);
  tasks.splice(tasks.indexOf(task), 1);
}
// Görevi kullanıcıya ata
function assignTaskToUser(taskId, userId) {
  const task = getTaskById(taskId);
  const user = users.getUserById(userId);

  if (!user) {
    const error = new Error('Kullanıcı bulunamadı.');
    error.statusCode = 404;
    throw error;
  }
  if(!task){
    const error = new Error('Görev bulunamadı.');
    error.statusCode = 404;
    throw error;
  }
  if(task.userId =="0"){
  task.userId = userId;
  user.tasks.push(task);}
  else{
    const error = new Error('Görev zaten bir kullanıcıya atanmış.');
    error.statusCode = 400;
    throw error;
  }
}
// Görevi tamamla
function completeTask(taskId) {
  const task = getTaskById(taskId);

  if (!task) {
    const error = new Error('Görev bulunamadı.');
    error.statusCode = 404;
    throw error;
  }

  task.status = 'completed';
  tasks.splice(tasks.indexOf(task), 1);
  tasks.push(task);
}
// Görevi ilerlet
function progressTask(taskId) {
  const task = getTaskById(taskId);

  if (!task) {
    const error = new Error('Görev bulunamadı.');
    error.statusCode = 404;
    throw error;
  }

  task.status = 'in-progress';
  tasks.splice(tasks.indexOf(task), 1);
  tasks.push(task);
}

module.exports = {
  listTasks,
  listTasksByAssigneeName,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
  assignTaskToUser,
  completeTask,
  progressTask,
  filterTasks,
  searchTasks,
  paginateTasks
};
