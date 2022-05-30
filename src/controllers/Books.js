const client = require("prom-client");

const {
  borrowBooks,
  registerBooks,
  setlLatencyHistogram,
} = require("../metrics");
const BooksModel = require("../models/Books");

class Books {
  static async findAllBooks(req, res) {
    try {
      const response = await BooksModel.find();
      const results = response.map((book) => ({
        id: book._id,
        title: book.title,
        borrow: book.borrow,
      }));

      return res.json(results);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    } finally {
      setlLatencyHistogram({
        startRequest: res.startRequest,
        route: req.route.path,
        statusCode: res.statusCode,
        method: req.method,
      });
    }
  }

  static async findBookById(req, res) {
    try {
      const { id } = req.params;
      if (!id)
        return res
          .status(400)
          .json({ error: "Exists fields mandatory were not filled" });

      const response = await BooksModel.findById(id);
      if (!response) {
        return res.status(404).json({ error: "Book is not found" });
      }

      const result = {
        id: response._id,
        title: response.title,
        description: response.description,
        borrow: response.borrow,
      };

      return res.json(result);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    } finally {
      setlLatencyHistogram({
        startRequest: res.startRequest,
        route: req.route.path,
        statusCode: res.statusCode,
        method: req.method,
      });
    }
  }

  static async saveBook(req, res) {
    try {
      const { title, description } = req.body;

      if (!title || !description)
        return res
          .status(400)
          .json({ error: "Exists fields mandatory were not filled" });

      await BooksModel.create({ title, description, borrow: false });

      registerBooks.inc();

      return res.status(201).end();
    } catch (error) {
      return res.status(500).json({ error: error.message });
    } finally {
      setlLatencyHistogram({
        startRequest: res.startRequest,
        route: req.route.path,
        statusCode: res.statusCode,
        method: req.method,
      });
    }
  }

  static async updateBorrowBook(req, res) {
    try {
      const { borrow } = req.body;
      const { id } = req.params;

      if (!id || typeof borrow !== "boolean")
        return res
          .status(400)
          .json({ error: "Exists fields mandatory were not filled" });

      await BooksModel.findByIdAndUpdate(id, { borrow });

      borrowBooks.inc({ status: borrow });

      return res.status(204).end();
    } catch (error) {
      return res.status(500).json({ error: error.message });
    } finally {
      setlLatencyHistogram({
        startRequest: res.startRequest,
        route: req.route.path,
        statusCode: res.statusCode,
        method: req.method,
      });
    }
  }

  static async metrics(req, res) {
    res.setHeader("Content-Type", client.register.contentType);
    res.send(await client.register.metrics());
  }

  static error(req, res) {
    try {
      throw new Error("Error");
    } catch (error) {
      return res.status(500).json({ error: error.message });
    } finally {
      setlLatencyHistogram({
        startRequest: res.startRequest,
        route: req.route.path,
        statusCode: res.statusCode,
        method: req.method,
      });
    }
  }

  static slow(req, res) {
    try {
      setTimeout(() => {
        return res.status(204).end();
      }, 1000);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    } finally {
      setlLatencyHistogram({
        startRequest: res.startRequest,
        route: req.route.path,
        statusCode: res.statusCode,
        method: req.method,
      });
    }
  }
}

module.exports = Books;
