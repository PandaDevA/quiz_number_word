const mongoCollections = require('../config/mongoCollections');
const words = mongoCollections.words;
let { ObjectId } = require('mongodb');

const exportedMethods = {

  async addWord(newWord) {
    if(newWord === undefined || newWord =='') {
      console.log("Failed in addWord! newWord is undefined");
      return false;
    }

    const wordCollection = await words();
    const word = await wordCollection.find().toArray();

    const isExist = false;
    word.map((worddata, index) => {
      if(worddata.word == newWord) {
        isExist = true;
        return;
      };
    });
    if(isExist) {
      console.log('The word is already exist');
      return false;
    }

    const newWordData = {
      word: newWord,
    };

    const newInsertInformation = await wordCollection.insertOne(newWordData);
    if (newInsertInformation.insertedCount === 0) {
      console.log('Could not add word');
      return false;
    }

    return newWord;
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

    let result;
    word.map((worddata, index) => {
      if(index == rndIndex) {
        result = worddata.word;
        return;
      };
    });
    return result;
  },

};

module.exports = exportedMethods;
