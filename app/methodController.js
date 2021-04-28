const data = require('../data');
const infos = data.infos;

function methodController(){
    return {
        async index(req, res){
            console.log('ajax method get request is received');
            let methodData = await infos.getMethod();
            let resData = {method: methodData};
            res.render('method', resData);
        },

        async save(req, res){
            console.log('ajax add request is received');
            let newData = req.body;
            let resData = {result: false};

            const result = await infos.saveMethod(newData.method);
            if(!result) res.status(500).send(resData);
            else {
                resData = {result: true};
                res.status(200).send(resData);
            }
        },

    }
}

module.exports = methodController;