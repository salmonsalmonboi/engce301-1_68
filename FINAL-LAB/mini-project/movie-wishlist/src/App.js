import React, { useState, useEffect } from 'react';

const LOCAL_STORAGE_KEY = 'movieWishlistApp.movies';

function App() {
  const [movies, setMovies] = useState([]);
  const [inputValue, setInputValue] = useState('');

  useEffect(() => {
    const storedMovies = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY));
    if (storedMovies) {
      setMovies(storedMovies);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(movies));
  }, [movies]);

  const handleAddMovie = (e) => {
    e.preventDefault();
    if (inputValue.trim() === '') return;

    const newMovie = {
      id: Date.now(),
      text: inputValue,
      watched: false,
    };

    setMovies(prevMovies => [newMovie, ...prevMovies]);
    setInputValue('');
  };

  const handleDeleteMovie = (id) => {
    setMovies(prevMovies => prevMovies.filter(movie => movie.id !== id));
  };
  
  // ==========================================================
  // === NEW: ส่วนที่เพิ่มสำหรับ Challenge 2.1
  // ==========================================================
  const handleToggleWatched = (id) => {
    setMovies(prevMovies =>
      prevMovies.map(movie => {
        // ถ้าเจอหนังที่ id ตรงกัน
        if (movie.id === id) {
          // ให้ return object ใหม่ โดยคัดลอกค่าเดิมมาทั้งหมด (...movie)
          // แล้วเปลี่ยนค่า watched ให้เป็นตรงกันข้าม
          return { ...movie, watched: !movie.watched };
        }
        // ถ้าไม่ใช่หนังที่ต้องการแก้ไข ก็ return ตัวเดิมกลับไป
        return movie;
      })
    );
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>🎬 Movie Wishlist</h1>
        <p>What do you want to watch next?</p>
      </header>

      <main>
        <form className="add-movie-form" onSubmit={handleAddMovie}>
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="e.g., The Matrix"
          />
          <button type="submit">Add</button>
        </form>

        <section className="movie-wishlist">
          <h2>My List</h2>
          {movies.length > 0 ? (
            <ul className="movie-list">
              {movies.map(movie => (
                // UPDATED: ส่วนที่แก้ไขสำหรับ Challenge 2.2
                <li
                  key={movie.id}
                  className={`movie-item ${movie.watched ? 'watched' : ''}`}
                >
                  <span onClick={() => handleToggleWatched(movie.id)}>
                    {movie.text}
                  </span>
                  <button onClick={() => handleDeleteMovie(movie.id)}>
                    &times;
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="empty-list-message">Your wishlist is empty. Add a movie to get started!</p>
          )}
        </section>
      </main>
    </div>
  );
}

export default App;