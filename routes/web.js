const mainController = require('../app/mainController');

function initRoute(app) {
    app.get('/*', mainController().index);
    app.post('/setting/word', mainController().word);
    app.post('/setting/add', mainController().add);
    app.post('/setting/delete', mainController().delete);
}

module.exports = initRoute;