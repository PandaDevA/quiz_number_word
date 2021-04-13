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

    let isExist = false;
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

  async updateWord(data) {
    if(!data || !data.oldword || !data.word || data.word =='' || !data.matchArray) {
      console.log("Failed in updateWord! word is undefined");
      return false;
    }

    const wordCollection = await words();
    const word = await wordCollection.find().toArray();

    let isExist = false;
    word.map((worddata, index) => {
      if(worddata.word == data.oldword) {
        isExist = true;
        return;
      };
    });
    if(!isExist) {
      console.log('The word is not exist');
      return false;
    }

    const newWordData = {
      word: data.word,
      matchArray: data.matchArray,
    };

    const newInsertInformation = await wordCollection.updateOne({word: data.oldword}, { $set: newWordData });
    if (newInsertInformation.updatedCount === 0) {
      console.log('Could not update word');
      // return false;
    }

    return true;
  },

  async removeword(delWord) {
    if (!delWord || delWord == '') {
      console.log( 'ReferenceError: You must provide an word to remove');
      return false;
    };

    const wordCollection = await words();
    try {
      const word = await wordCollection.findOne({word: delWord});
      const deletionInfo = await wordCollection.removeOne({ _id: word._id });
      if (deletionInfo.deletedCount === 0) {
        console.log(`Could not delete the word`);
        return false;
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

  async getAll(filter, pageId, countPerPage) {
    let perPage = countPerPage ? Number.parseInt(countPerPage) : 10;
    let curPage = Number.parseInt(pageId);
    let result = {};

    const wordCollection = await words();
    let total = await wordCollection.find({}).count();
    if(!total) {
        console.log('could not get the total of words');
        total = 0;
    }
    else console.log(`page total is : ${total}`);

    let count = await wordCollection.find({word: {$regex: filter.toUpperCase()}}).count();
    if(!count) {
        console.log('could not get the count of words');
        count = 0;
    }
    else console.log(`page count is : ${count}`);

    if(Number.parseInt(count) <= perPage * ( curPage - 1 )) curPage = 1;
    try {
        const wordData = await wordCollection.find({word: {$regex: filter.toUpperCase()}}).skip(perPage * (curPage - 1)).limit(perPage).toArray();
        if(wordData)
            result = { result: wordData, totalNum: total, pageInfo: {perPage: perPage, count: count, curPage: curPage} };
        else 
            result = { result: [], totalNum: total, pageInfo: {perPage: 10, count: 0, curPage: 1}, error: 'could not get word data' };
        return result;
    } catch (e) {
        console.log(`Error while getWordList: ${e}`);
        result = { result: [], totalNum: total, pageInfo: {perPage: 10, count: 0, curPage: 1}, error: e };
        return result;
    }
  },
};

module.exports = exportedMethods;
