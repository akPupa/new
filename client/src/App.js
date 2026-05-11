import React, { useEffect } from "react";
import "./App.css";
import axios from "axios";

const API_BASE_URL =
  process.env.REACT_APP_API_URL || "http://localhost:8000";

function App() {
  const [movieName, setMovieName] = React.useState("");
  const [movieReview, setMovieReview] = React.useState("");
  const [apiData, setApiData] = React.useState([]);
  const [newReview, setNewReview] = React.useState("");

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/api/get`
      );

      setApiData(response.data);
    } catch (error) {
      console.log("Fetch error:", error);
    }
  };

  const formSubmit = async () => {
    if (!movieName || !movieReview) {
      alert("Please enter movie name and review");
      return;
    }

    try {
      await axios.post(`${API_BASE_URL}/apidata`, {
        movieName,
        movieReview,
      });

      setMovieName("");
      setMovieReview("");

      fetchReviews();
    } catch (error) {
      console.log("Insert error:", error);
    }
  };

  const deleteAllFunc = async () => {
    try {
      await axios.delete(
        `${API_BASE_URL}/api/deleteall`
      );

      fetchReviews();
    } catch (error) {
      console.log("Delete all error:", error);
    }
  };

  const deleteReview = async (id) => {
    try {
      await axios.delete(
        `${API_BASE_URL}/api/delete/${id}`
      );

      fetchReviews();
    } catch (error) {
      console.log("Delete error:", error);
    }
  };

  const updateReview = async (id) => {
    if (!newReview) {
      alert("Please enter updated review");
      return;
    }

    try {
      await axios.put(
        `${API_BASE_URL}/api/update`,
        {
          id,
          movieReview: newReview,
        }
      );

      setNewReview("");

      fetchReviews();
    } catch (error) {
      console.log("Update error:", error);
    }
  };

  return (
    <div className="App">
      <h2>CRUD App</h2>

      <label>Movie Name:</label>

      <input
        type="text"
        value={movieName}
        onChange={(e) =>
          setMovieName(e.target.value)
        }
      />

      <label>Review:</label>

      <input
        type="text"
        value={movieReview}
        onChange={(e) =>
          setMovieReview(e.target.value)
        }
      />

      <button
        type="submit"
        onClick={formSubmit}
      >
        Submit Data
      </button>

      <button onClick={deleteAllFunc}>
        Delete ALL Data
      </button>

      <div className="outerCard">
        {apiData.map((item) => (
          <div key={item.id} className="card">
            <h1>{item.movieName}</h1>

            <p>{item.movieReview}</p>

            <button
              onClick={() =>
                deleteReview(item.id)
              }
            >
              Delete
            </button>

            <input
              type="text"
              placeholder="Update review"
              value={newReview}
              onChange={(e) =>
                setNewReview(e.target.value)
              }
            />

            <button
              onClick={() =>
                updateReview(item.id)
              }
            >
              Update
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
