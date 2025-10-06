// ----- DATABASE SETUP -----
use('plp_bookstore');

// ----- BASIC CRUD OPERATIONS -----

// 1. Find all books in a specific genre
db.books.find({ genre: "Fiction" }).pretty();

// 2. Find books published after a certain year
db.books.find({ published_year: { $gt: 2010 } }).pretty();

// 3. Find books by a specific author
db.books.find({ author: "Harper Lee" }).pretty();

// 4. Update the price of a specific book
db.books.updateOne(
  { title: "To Kill a Mockingbird" },
  { $set: { price: 15.99 } }
);

// 5. Delete a book by its title
db.books.deleteOne({ title: "To Kill a Mockingbird" });

// ----- ADVANCED QUERIES -----

// 6. Find books that are both in stock and published after 2010
db.books.find({ in_stock: true, published_year: { $gt: 2010 } });

// 7. Use projection to return only title, author, and price
db.books.find({}, { _id: 0, title: 1, author: 1, price: 1 });

// 8. Sort books by price (ascending)
db.books.find().sort({ price: 1 });

// 9. Sort books by price (descending)
db.books.find().sort({ price: -1 });

// 10. Pagination: Show 5 books per page
// Page 1
db.books.find().limit(5);
// Page 2
db.books.find().skip(5).limit(5);

// ----- AGGREGATION PIPELINES -----

// 11. Average price of books by genre
db.books.aggregate([
  { $group: { _id: "$genre", averagePrice: { $avg: "$price" } } }
]);

// 12. Author with the most books
db.books.aggregate([
  { $group: { _id: "$author", count: { $sum: 1 } } },
  { $sort: { count: -1 } },
  { $limit: 1 }
]);

// 13. Group books by publication decade
db.books.aggregate([
  {
    $group: {
      _id: { $floor: { $divide: ["$published_year", 10] } },
      count: { $sum: 1 }
    }
  },
  {
    $project: {
      decade: { $concat: [{ $toString: { $multiply: ["$_id", 10] } }, "s"] },
      count: 1,
      _id: 0
    }
  }
]);

// ----- INDEXING -----

// 14. Create index on title
db.books.createIndex({ title: 1 });

// 15. Create compound index on author and published_year
db.books.createIndex({ author: 1, published_year: -1 });

// 16. Use explain() to check performance
db.books.find({ title: "To Kill a Mockingbird" }).explain("executionStats");

