"use client";
import { useEffect, useState } from "react";
import PopUpCreate from "./PopUpCreate";

type Book = {
  id: number;
  name: string;
  author: string;
  description: string;
  cover: string;
  categories: string[];
  availability: string[];
};

export default function Home() {
  const [books, setBooks] = useState<Book[]>([]);
  const [searchBooks, setSearchBooks] = useState<Book[]>([]);
  const [showPopUp, setShowPopUp] = useState(false);

  useEffect(() => {
    async function fetchData() {
      const response = await fetch("/api");
      const data = await response.json();
      setBooks(data);
      setSearchBooks(data);
    }
    fetchData();
  }, []);

  const handleSearchBooks = (e: any) => {
    const newBooks = books.filter((book) => {
      return (
        book.name.toLowerCase().includes(e.target.value.toLowerCase()) ||
        book.author.toLowerCase().includes(e.target.value.toLowerCase())
      );
    });
    setSearchBooks(newBooks);
  };

  return (
    <div className="container">
      {showPopUp && <PopUpCreate setShowPopUp={setShowPopUp} />}
      <div className="searchAndAdd">
        <div className="search">
          <svg viewBox="0 0 512 512">
            <path d="M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376c-34.4 25.2-76.8 40-122.7 40C93.1 416 0 322.9 0 208S93.1 0 208 0S416 93.1 416 208zM208 352a144 144 0 1 0 0-288 144 144 0 1 0 0 288z" />
          </svg>
          <input
            type="text"
            placeholder="Search..."
            onChange={handleSearchBooks}
          />
        </div>
        <button className="add" onClick={() => setShowPopUp(true)}>
          <svg viewBox="0 0 448 512">
            <path d="M256 80c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 144L48 224c-17.7 0-32 14.3-32 32s14.3 32 32 32l144 0 0 144c0 17.7 14.3 32 32 32s32-14.3 32-32l0-144 144 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-144 0 0-144z" />
          </svg>
        </button>
      </div>
      <div className="books">
        {searchBooks.map((book, index) => (
          <div className="book" key={book.id}>
            {index % 2 ? (
              <>
                <img className="image" src={book.cover} alt={book.name} />
                <div className="bookInfo">
                  <h1 className="title">
                    {book.name} <br /> By{" "}
                    <span className="author"> {book.author} </span>
                  </h1>
                  <p className="description">{book.description}</p>
                </div>
              </>
            ) : (
              <>
                <div className="bookInfo">
                  <h1 className="title">
                    {book.name} <br /> By{" "}
                    <span className="author">{book.author}</span>
                  </h1>
                  <p className="description">{book.description}</p>
                </div>
                <img className="image" src={book.cover} alt={book.name} />
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
