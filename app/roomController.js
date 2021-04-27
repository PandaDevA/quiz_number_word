const data = require('../data');
const rooms = data.rooms;

function roomController(){
    return {
        async index(req, res){
            console.log('ajax room get request is received');
            let result = await rooms.listTournament();
            for (let i in result) {
                const room = result[i];
                room['id'] = String(room._id);
                room['startDateTimeString'] = room.startDateTime.toLocaleString();
                result[i] = room;
            }
            let resData = {messages: {error: 'no error'}, rooms: {result: result}};
            console.log(result);
            res.render('tournament', resData);
        },

        async delete(req, res){
            console.log('ajax delete request is received');
            let { room_id } = req.body;
            let resData = {result: false};

            const result = await rooms.removeRoom({room_id});
            resData = {result};
            if(!resData.result) res.status(404).send(resData);
            else res.status(200).send(resData);
        },

        async add(req, res){
            console.log('ajax add request is received');
            let newData = req.body;
            let resData = {result: false};
            let start = new Date(newData.start);

            const result = await rooms.createRoom({joiningFee: parseInt(newData.fee), prize: parseInt(newData.prize), startDateTime: start});
            if(!result) res.status(500).send(resData);
            else {
                resData = {result: result.id};
                res.status(200).send(resData);
            }
        },

    }
}

module.exports = roomController;