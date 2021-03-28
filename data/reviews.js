const mongoCollections = require('../config/mongoCollections');
const reviews = mongoCollections.reviews;
const books = mongoCollections.books;
let { ObjectId } = require('mongodb');

let exportedMethods = {
  async getAllReviews(book_id) {
    if (!book_id) throw 'ReferenceError: You must provide an id to search for';
    if (typeof(book_id) != 'string' || book_id.trim() == '') throw TypeError;
    
    let parsedId;
    try {
      parsedId = ObjectId(book_id); 
    } catch (error) {
      throw SyntaxError;
    }
    const bookCollection = await books();
    const book = await bookCollection.findOne({_id:parsedId}, {'reviews' : 1});
    if (!book || book.reviews.length==0) throw 'No reviews in system!';
    return book.reviews;     
  },
  // This is a fun new syntax that was brought forth in ES6, where we can define
  // methods on an object with this shorthand!
  async getReviewById(id) {
    if (!id) throw 'ReferenceError: You must provide an id to search for';
    if (typeof(id) != 'string' || id.trim() == '') throw TypeError;
    
    let parsedId;
    try {
      parsedId = ObjectId(id); 
    } catch (error) {
      throw SyntaxError;
    }
    const bookCollection = await books();
    
    const book = await bookCollection.findOne({ reviews: { $elemMatch: { _id: parsedId } } }, {'reviews': 1});
    if(!book) throw 'Review not found';
    let review = null;
    book.reviews.forEach(element => {
      if(String(element._id) == id)
      {
        review = element;
        return;
      }
    });

    if (!review) throw 'Review not found';
    return review;
  },
  async addReview(book_id, title, reviewer, rating, dateOfReview, review) {
    if (!book_id) throw 'ReferenceError: You must provide an id to search for';
    if (typeof(book_id) != 'string' || book_id.trim() == '') throw TypeError;
    
    let parsedId;
    try {
      parsedId = ObjectId(book_id); 
    } catch (error) {
      throw SyntaxError;
    }

    if(typeof(title)!='string' || title.trim() == '') throw TypeError;
    
    if(typeof(reviewer)!='string' || reviewer.trim() == '') throw TypeError;
  
    if(typeof(review)!='string' || review.trim() == '') throw TypeError;

    if(!Number.isInteger(rating)) throw TypeError;
    if(rating < 1 || rating > 5) throw RangeError;

    if(dateOfReview === undefined || typeof(dateOfReview) != 'string')  throw TypeError;
    const pubDate = new Date(dateOfReview);
    if(isNaN(Date.parse(pubDate))) throw TypeError;
    let curDate = new Date();
    if(pubDate < new Date('1/1/1930') || pubDate > curDate) throw RangeError;
    const bookCollection = await books();

    let book = await bookCollection.findOne({ _id : parsedId });

    if (!book) throw 'Review not found';

    let newReview = {
      _id: new ObjectId(),
      title: title,
      reviewer: reviewer,
      rating: rating,
      dateOfReview: dateOfReview,
      review: review
    };

    book.reviews.push(newReview);

    const updateInfo = await bookCollection.updateOne(
      { _id: parsedId },
      { $set: book } );

    if (!updateInfo.matchedCount && !updateInfo.modifiedCount)
      throw 'Update failed';

    return book;
  },
  async removeReview(id) {
    if (!id) throw 'ReferenceError: You must provide an id to search for';
    if (typeof(id) != 'string' || id.trim() == '') throw TypeError;
    
    let parsedId;
    try {
      parsedId = ObjectId(id); 
    } catch (error) {
      throw SyntaxError;
    }
    const bookCollection = await books();
    const book = await bookCollection.findOne({ 'reviews._id' : parsedId }, {'reviews': 1});
    if(!book) throw 'Review not found';
    let review = null;
    let index = -1;
    for(let i=0; i<book.reviews.length; i++){
      const element = book.reviews[i];
      if(String(element._id) == id)
      {
        index = i;
        break;
      }
    };


    if (index == -1) throw 'Review not found';

    book.reviews.splice(index, 1);

    const updateInfo = await bookCollection.updateOne(
      { _id: book._id },
      { $set: book } );

    if (!updateInfo.matchedCount && !updateInfo.modifiedCount)
      throw 'Update failed';
      
    return {"reviewId": id, "deleted": true};
  }
};

module.exports = exportedMethods;
