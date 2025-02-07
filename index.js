const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(bodyParser.json());

const dataFilePath = path.join(__dirname, 'data.json');
let books = require(dataFilePath);

const saveBooksData = () => {
  fs.writeFileSync(dataFilePath, JSON.stringify(books, null, 2));
};

app.post('/books', (req, res) => {
  const { book_id, title, author, genre, year, copies } = req.body;

  if (!book_id || !title || !author || !genre || !year || !copies) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  const newBook = {
    book_id,
    title,
    author,
    genre,
    year,
    copies
  };

  books.push(newBook);
  saveBooksData();
  res.status(201).json(newBook);
});


app.get('/books', (req, res) => {
  res.status(200).json(books);
});

app.get('/books/:id', (req, res) => {
  const bookId = req.params.id;
  const book = books.find(b => b.book_id === bookId);

  if (!book) {
    return res.status(404).json({ error: 'Book not found' });
  }

  res.status(200).json(book);
});

app.put('/books/:id', (req, res) => {
  const bookId = req.params.id;
  const bookIndex = books.findIndex(b => b.book_id === bookId);

  if (bookIndex === -1) {
    return res.status(404).json({ error: 'Book not found' });
  }

  const { title, author, genre, year, copies } = req.body;

  if (title) books[bookIndex].title = title;
  if (author) books[bookIndex].author = author;
  if (genre) books[bookIndex].genre = genre;
  if (year) books[bookIndex].year = year;
  if (copies) books[bookIndex].copies = copies;

  saveBooksData();
  res.status(200).json(books[bookIndex]);
});

app.delete('/books/:id', (req, res) => {
  const bookId = req.params.id;
  const bookIndex = books.findIndex(b => b.book_id === bookId);

  if (bookIndex === -1) {
    return res.status(404).json({ error: 'Book not found' });
  }

  books.splice(bookIndex, 1);
  saveBooksData();
  res.status(200).json({ message: 'Book deleted successfully' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port http://localhost:${PORT}`);
});
