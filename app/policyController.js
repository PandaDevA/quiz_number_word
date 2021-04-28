const data = require('../data');
const infos = data.infos;

function policyController(){
    return {
        async index(req, res){
            console.log('ajax policy get request is received');
            let policyData = await infos.getPolicy();
            let resData = {policy: policyData};
            res.render('policy', resData);
        },

        async save(req, res){
            console.log('ajax add request is received');
            let newData = req.body;
            let resData = {result: false};

            const result = await infos.savePolicy(newData.policy);
            if(!result) res.status(500).send(resData);
            else {
                resData = {result: true};
                res.status(200).send(resData);
            }
        },

    }
}

module.exports = policyController;