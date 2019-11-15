const privateRoutes = require('./routes/privateRoutes');
const publicRoutes = require('./routes/publicRoutes');
const boardAdminRoutes = require('./routes/boardAdminRoutes');
const boardMemberRoutes = require('./routes/boardMemberRoutes');
const teamAdminRoutes = require('./routes/teamAdminRoutes');
const teamMemberRoutes = require('./routes/teamMemberRoutes');

module.exports = {
  privateRoutes,
  publicRoutes,
  boardAdminRoutes,
  boardMemberRoutes,
  teamAdminRoutes,
  teamMemberRoutes
};