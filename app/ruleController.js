const data = require('../data');
const infos = data.infos;

function ruleController(){
    return {
        async index(req, res){
            console.log('ajax rule get request is received');
            let ruleData = await infos.getRule();
            let resData = {rule: ruleData};
            res.render('rule', resData);
        },

        async save(req, res){
            console.log('ajax add request is received');
            let newData = req.body;
            let resData = {result: false};

            const result = await infos.saveRule(newData.rule);
            if(!result) res.status(500).send(resData);
            else {
                resData = {result: true};
                res.status(200).send(resData);
            }
        },

    }
}

module.exports = ruleController;