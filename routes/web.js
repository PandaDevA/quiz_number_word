const mainController = require('../app/mainController');
const roomController = require('../app/roomController');

function initRoute(app) {
    app.get('/', mainController().index);
    app.post('/setting/word', mainController().word);
    app.post('/setting/add', mainController().add);
    app.post('/setting/update', mainController().update);
    app.post('/setting/delete', mainController().delete);

    app.get('/room', roomController().index);
    app.post('/tournament/add', roomController().add);
    app.post('/tournament/delete', roomController().delete);
}

module.exports = initRoute;