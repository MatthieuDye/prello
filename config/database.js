let debug = require('debug')('app:db');
let mongoose = require('mongoose');

mongoose.connect('mongodb://' + process.env.DB_URL + '/' + process.env.DB_NAME, { useNewUrlParser: true });
mongoose.set('useCreateIndex', true);
mongoose.set('useFindAndModify', false);

mongoose.connection.on('error', console.error.bind(console, 'connection error:'));

mongoose.connection.once('connected', () => {
    debug('Mongoose conected at ' + process.env.DB_URL + ' - ' + process.env.DB_NAME)
});