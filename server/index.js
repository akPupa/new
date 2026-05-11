const express = require("express");
const mysql = require("mysql");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();

const PORT = process.env.PORT || 8000;

app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

const db = mysql.createConnection({
  host: process.env.MYSQLHOST || "localhost",
  user: process.env.MYSQLUSER || "nikhil",
  password: process.env.MYSQLPASSWORD || "password",
  database: process.env.MYSQLDATABASE || "crud",
  port: process.env.MYSQLPORT
    ? Number(process.env.MYSQLPORT)
    : 3306,
});

db.connect((err) => {
  if (err) {
    console.log("Database connection failed:", err);
  } else {
    console.log("Connected successfully!");
  }
});

app.get("/", (req, res) => {
  res.send("API Running");
});

app.get("/health", (req, res) => {
  res.send("Server Running");
});

app.post("/apidata", (req, res) => {
  const movieName = req.body.movieName;
  const movieReview = req.body.movieReview;

  const insertSql =
    "INSERT INTO movie_review (movieName, movieReview) VALUES (?, ?)";

  db.query(insertSql, [movieName, movieReview], (err, result) => {
    if (err) {
      console.log(err);
      return res.status(500).send(err);
    }

    res.send({
      success: true,
      message: "Review added successfully",
      result,
    });
  });
});

app.get("/api/get", (req, res) => {
  const selectSql = "SELECT * FROM movie_review";

  db.query(selectSql, (err, result) => {
    if (err) {
      console.log(err);
      return res.status(500).send(err);
    }

    res.send(result);
  });
});

app.delete("/api/delete/:id", (req, res) => {
  const id = req.params.id;

  const sqlDelete =
    "DELETE FROM movie_review WHERE id = ?";

  db.query(sqlDelete, [id], (err, result) => {
    if (err) {
      console.log(err);
      return res.status(500).send(err);
    }

    res.send({
      success: true,
      message: "Review deleted successfully",
      result,
    });
  });
});

app.delete("/api/deleteall", (req, res) => {
  const sqlDeleteAll = "DELETE FROM movie_review";

  db.query(sqlDeleteAll, (err, result) => {
    if (err) {
      console.log(err);
      return res.status(500).send(err);
    }

    res.send({
      success: true,
      message: "All reviews deleted successfully",
      result,
    });
  });
});

app.put("/api/update", (req, res) => {
  const id = req.body.id;
  const review = req.body.movieReview;

  const sqlUpdate =
    "UPDATE movie_review SET movieReview = ? WHERE id = ?";

  db.query(sqlUpdate, [review, id], (err, result) => {
    if (err) {
      console.log(err);
      return res.status(500).send(err);
    }

    res.send({
      success: true,
      message: "Review updated successfully",
      result,
    });
  });
});

app.listen(PORT, () => {
  console.log("Server started at", PORT);
});
