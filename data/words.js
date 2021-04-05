const mongoCollections = require('../config/mongoCollections');
const words = mongoCollections.words;
let { ObjectId } = require('mongodb');

const exportedMethods = {

  async addWord(data) {
    if(!data || !data.word || data.word =='' || !data.matchArray) {
      console.log("Failed in addWord! word is undefined");
      return false;
    }

    const wordCollection = await words();
    const word = await wordCollection.find().toArray();

    const isExist = false;
    word.map((worddata, index) => {
      if(worddata.word == data.word) {
        isExist = true;
        return;
      };
    });
    if(isExist) {
      console.log('The word is already exist');
      return false;
    }

    const newWordData = {
      word: data.word,
      matchArray: data.matchArray,
    };

    const newInsertInformation = await wordCollection.insertOne(newWordData);
    if (newInsertInformation.insertedCount === 0) {
      console.log('Could not add word');
      return false;
    }

    return data;
  },

  async removeword(delWord) {
    if (!delWord || delWord == '') throw 'ReferenceError: You must provide an word to remove';

    const wordCollection = await words();
    try {
      const word = await wordCollection.findOne({word: delWord});
      const deletionInfo = await wordCollection.removeOne({ _id: word._id });
      if (deletionInfo.deletedCount === 0) {
        throw `Could not delete the word`;
      }
    } catch (e) {
      console.log('the word is not exist');
      return false;
    }
    return true;
  },

  async getRandomWord() {
    const wordCollection = await words();
    const word = await wordCollection.find().toArray();

    const rndIndex =  Math.floor(Math.random() * word.length);

    let result = {};
    word.map((worddata, index) => {
      if(index == rndIndex) {
        result['word'] = worddata.word;
        result['matchArray'] = worddata.matchArray;
        return;
      };
    });
    return result;
  },

};

module.exports = exportedMethods;
