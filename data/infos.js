const mongoCollections = require('../config/mongoCollections');
const infos = mongoCollections.infos;
let { ObjectId } = require('mongodb');

const exportedMethods = {
    async getRule(){
        const infoCollection = await infos();
        const rule = await infoCollection.findOne({ type: 'rule' });
        return rule.content;
    },

    async saveRule(newRule){
        const infoCollection = await infos();
        const rule = await infoCollection.findOne({ type: 'rule' });
        try{
            rule.content = newRule;
            const updatedInfo = await infoCollection.updateOne({ _id: rule._id }, { $set: rule });
        } catch(error){
            return false;
        }
        return true;
    },

    async setRule(rule){
        const infoCollection = await infos();

        const newRule = {
            type: 'rule',
            content: rule,
        };

        const newInsertInformation = await infoCollection.insertOne(newRule);
        if (newInsertInformation.insertedCount === 0) {
            console.log('Could not add rule');
            return false;
        }
        return true;
    },

    async getMethod(){
        const infoCollection = await infos();
        const method = await infoCollection.findOne({ type: 'method' });
        return method.content;
    },

    async saveMethod(newMethod){
        const infoCollection = await infos();
        const method = await infoCollection.findOne({ type: 'method' });
        try{
            method.content = newMethod;
            const updatedInfo = await infoCollection.updateOne({ _id: method._id }, { $set: method });
        } catch(error){
            return false;
        }
        return true;
    },

    async setMethod(method){
        const infoCollection = await infos();

        const newMethod = {
            type: 'method',
            content: method,
        };

        const newInsertInformation = await infoCollection.insertOne(newMethod);
        if (newInsertInformation.insertedCount === 0) {
            console.log('Could not add method');
            return false;
        }
        return true;
    },

    async getPolicy(){
        const infoCollection = await infos();
        const policy = await infoCollection.findOne({ type: 'policy' });
        return policy.content;
    },

    async savePolicy(newPolicy){
        const infoCollection = await infos();
        const policy = await infoCollection.findOne({ type: 'policy' });
        try{
            policy.content = newPolicy;
            const updatedInfo = await infoCollection.updateOne({ _id: policy._id }, { $set: policy });
        } catch(error){
            return false;
        }
        return true;
    },

    async setPolicy(policy){
        const infoCollection = await infos();

        const newPolicy = {
            type: 'policy',
            content: policy,
        };

        const newInsertInformation = await infoCollection.insertOne(newPolicy);
        if (newInsertInformation.insertedCount === 0) {
            console.log('Could not add policy');
            return false;
        }
        return true;
    },
    
};

module.exports = exportedMethods;