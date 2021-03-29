const mongoCollections = require('../config/mongoCollections');
const words = require('../data');

const generateRandom = (from, to) => {
  let start = from, end = to;
  start = from > to ? to : from; 
  return start + Math.floor(Math.random() * (end - start + 1));
};

const randomCalculate = (array, tmp) => {
  let result = tmp;
  const rdIdx = generateRandom(0, array.length - 1);
  if (!tmp) {
    result = array[rdIdx];
  } else {
    const sign = generateRandom(0, 3);
    switch(sign) {
        case 0:
            result = tmp + array[rdIdx];
            break;
        case 1:
            result = tmp * array[rdIdx];
            break;
        case 2:
            result = Math.abs(tmp - array[rdIdx]);
            break;
        case 3:
            if (tmp % array[rdIdx] != 0) result = tmp + array[rdIdx];
            else result = tmp / array[rdIdx];
            break;
    }
  }
  array.splice(rdIdx, 1) ;
  return result;
};

const generatedNumber = () => {
  let array = [];
  let data = {array: []};
  for (let i = 0; i<5; i++)
    array.push(generateRandom(1, 9));
  array.push(generateRandom(10, 99));
  data.array = Array.from(array);

  let result = 0;
  while (array.length > 0) {
      result = randomCalculate(array, result);
  }
  if(result > 100 && result < 999) {
      data.result = result;
      return data;
  }
  return 0;
};

const exportedMethods = {

  getNumberData() {
    let data = {array: [9, 3, 8, 2, 3, 75], result: 450};
    // while(data == undefined || data == 0) {
    //   data = generatedNumber()
    // }
    return data;
  },

  getWordData() {
    let data;
    words.getRandomWord().then((wordData) => {
      data = wordData;
    });
    return data;
  },

};

module.exports = exportedMethods;
