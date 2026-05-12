const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();

const PORT = process.env.PORT || 8000;

app.use(cors({
  origin: '*'
}));
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Railway MySQL Pool Connection
const db = mysql.createPool({
  connectionLimit: 10,
  host: process.env.MYSQLHOST,
  user: process.env.MYSQLUSER,
  password: process.env.MYSQLPASSWORD,
  database: process.env.MYSQLDATABASE,
  // port: Number(process.env.MYSQLPORT),
  port: Number(process.env.MYSQLPORT || 3306),
});

// Test DB connection
db.getConnection((err, connection) => {
  if (err) {
    console.log("DB CONNECTION ERROR:", err);
  } else {
    console.log("Database connected successfully!");

    connection.release();
  }
});

// Root Route
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "API Running",
  });
});
// app.get("/", (req, res) => {
//   res.send("API Running");
// });

// Health Route
app.get("/health", (req, res) => {
  res.send("Server Running");
});

// Create Review
app.post("/apidata", (req, res) => {
  const movieName = req.body.movieName;
  const movieReview = req.body.movieReview;

  const insertSql =
    "INSERT INTO movie_review (movieName, movieReview) VALUES (?, ?)";

  db.query(insertSql, [movieName, movieReview], (err, result) => {
    if (err) {
      console.log("INSERT ERROR:", err);

      return res.status(500).send({
        success: false,
        error: err,
      });
    }

    res.send({
      success: true,
      message: "Review added successfully",
      result,
    });
  });
});

// Get Reviews
app.get("/api/get", (req, res) => {
  const selectSql = "SELECT * FROM movie_review";

  db.query(selectSql, (err, result) => {
    if (err) {
      console.log("GET ERROR:", err);

      return res.status(500).send({
        success: false,
        error: err,
      });
    }

    res.send(result);
  });
});

// Delete Single Review
app.delete("/api/delete/:id", (req, res) => {
  const id = req.params.id;

  const sqlDelete =
    "DELETE FROM movie_review WHERE id = ?";

  db.query(sqlDelete, [id], (err, result) => {
    if (err) {
      console.log("DELETE ERROR:", err);

      return res.status(500).send({
        success: false,
        error: err,
      });
    }

    res.send({
      success: true,
      message: "Review deleted successfully",
      result,
    });
  });
});

// Delete All Reviews
app.delete("/api/deleteall", (req, res) => {
  const sqlDeleteAll = "DELETE FROM movie_review";

  db.query(sqlDeleteAll, (err, result) => {
    if (err) {
      console.log("DELETE ALL ERROR:", err);

      return res.status(500).send({
        success: false,
        error: err,
      });
    }

    res.send({
      success: true,
      message: "All reviews deleted successfully",
      result,
    });
  });
});

// Update Review
app.put("/api/update", (req, res) => {
  const id = req.body.id;
  const review = req.body.movieReview;

  const sqlUpdate =
    "UPDATE movie_review SET movieReview = ? WHERE id = ?";

  db.query(sqlUpdate, [review, id], (err, result) => {
    if (err) {
      console.log("UPDATE ERROR:", err);

      return res.status(500).send({
        success: false,
        error: err,
      });
    }

    res.send({
      success: true,
      message: "Review updated successfully",
      result,
    });
  });
});

// Start Server
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server started at ${PORT}`);
});
