const { Router } = require("express");

const BooksController = require("./controllers/Books");

const router = Router();

router.get("/books/metrics", BooksController.metrics);

router.get("/books", BooksController.findAllBooks);

router.get("/books/error", BooksController.error);

router.get("/books/slow", BooksController.slow);

router.post("/books", BooksController.saveBook);

router.get("/books/:id", BooksController.findBookById);

router.patch("/books/:id/borrow", BooksController.updateBorrowBook);

module.exports = router;
