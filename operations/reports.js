const { tasks } = require('../data/store');

const statuses = ['pending', 'in-progress', 'completed'];

function getCountByStatus(status) {
  if (!statuses.includes(status)) {
    const error = new Error(`Geçersiz görev durumu: ${status}.`);
    error.statusCode = 400;
    throw error;
  }

  return tasks.filter((task) => task.status === status).length;
}

function getSummary() {
  const byStatus = Object.fromEntries(
    statuses.map((status) => [status, getCountByStatus(status)])
  );

  return {
    total: tasks.length,
    byStatus,
  };
}

module.exports = { getCountByStatus, getSummary };
