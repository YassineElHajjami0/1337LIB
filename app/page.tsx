"use client";
import { useEffect, useState } from "react";
import PopUpCreate from "./PopUpCreate";
import PopUpUpdate from "./PopUpUpdate";
import PopUpDelete from "./PopUpDelete";
import BookModel from "./bookModel";

type Book = {
  id: number | null;
  name: string;
  author: string;
  description: string;
  cover: string | File | null;
  category: string | null;
  availability: boolean | undefined;
};

export default function Home() {
  const [books, setBooks] = useState<Book[]>([]);
  const [searchBooks, setSearchBooks] = useState<Book[]>([]);
  const [showPopUp, setShowPopUp] = useState({
    create: false,
    update: false,
    delete: false,
  });
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);

  useEffect(() => {
    async function fetchData() {
      const response = await fetch("/api");
      const data = await response.json();
      setBooks(data);
      setSearchBooks(data);
    }
    fetchData();
  }, []);

  useEffect(() => {
    console.log("showPopUp changed:", showPopUp);
  }, [showPopUp]);

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
    <div
      className={
        showPopUp.create // || showPopUp.update || showPopUp.delete
          ? "container noScroll"
          : "container"
      }
    >
      {showPopUp.create && <PopUpCreate setShowPopUp={setShowPopUp} />}
      {showPopUp.update && (
        <PopUpUpdate
          setBooks={setBooks}
          book={selectedBook}
          setShowPopUp={setShowPopUp}
        />
      )}
      {showPopUp.delete && (
        <PopUpDelete book={selectedBook} setShowPopUp={setShowPopUp} />
      )}
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
        <button
          className="add"
          onClick={() => setShowPopUp({ ...showPopUp, create: true })}
        >
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
                {/* <div className="canvasContainer">
                  <BookModel />
                </div> */}
                <img
                  className="image"
                  src={book.cover?.toString() || ""}
                  alt={book.name}
                />
                <div className="bookInfo">
                  <h1 className="title">
                    {book.name} <br /> By{" "}
                    <span className="author"> {book.author} </span>
                  </h1>
                  <p className="description">{book.description}</p>
                  <svg
                    className="editBook"
                    onClick={() => {
                      setShowPopUp({ ...showPopUp, update: true });
                      setSelectedBook(book);
                    }}
                    width={30}
                    height={30}
                    viewBox="0 0 512 512"
                  >
                    <path d="M441 58.9L453.1 71c9.4 9.4 9.4 24.6 0 33.9L424 134.1 377.9 88 407 58.9c9.4-9.4 24.6-9.4 33.9 0zM209.8 256.2L344 121.9 390.1 168 255.8 302.2c-2.9 2.9-6.5 5-10.4 6.1l-58.5 16.7 16.7-58.5c1.1-3.9 3.2-7.5 6.1-10.4zM373.1 25L175.8 222.2c-8.7 8.7-15 19.4-18.3 31.1l-28.6 100c-2.4 8.4-.1 17.4 6.1 23.6s15.2 8.5 23.6 6.1l100-28.6c11.8-3.4 22.5-9.7 31.1-18.3L487 138.9c28.1-28.1 28.1-73.7 0-101.8L474.9 25C446.8-3.1 401.2-3.1 373.1 25zM88 64C39.4 64 0 103.4 0 152L0 424c0 48.6 39.4 88 88 88l272 0c48.6 0 88-39.4 88-88l0-112c0-13.3-10.7-24-24-24s-24 10.7-24 24l0 112c0 22.1-17.9 40-40 40L88 464c-22.1 0-40-17.9-40-40l0-272c0-22.1 17.9-40 40-40l112 0c13.3 0 24-10.7 24-24s-10.7-24-24-24L88 64z" />
                  </svg>
                  <svg
                    className="deleteBook"
                    onClick={() => {
                      setSelectedBook(book);
                      setShowPopUp({ ...showPopUp, delete: true });
                    }}
                    width={30}
                    height={30}
                    viewBox="0 0 448 512"
                  >
                    <path d="M135.2 17.7L128 32 32 32C14.3 32 0 46.3 0 64S14.3 96 32 96l384 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-96 0-7.2-14.3C307.4 6.8 296.3 0 284.2 0L163.8 0c-12.1 0-23.2 6.8-28.6 17.7zM416 128L32 128 53.2 467c1.6 25.3 22.6 45 47.9 45l245.8 0c25.3 0 46.3-19.7 47.9-45L416 128z" />
                  </svg>
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
                  <svg
                    className="editBook"
                    onClick={() => {
                      setSelectedBook(book);
                      setShowPopUp({ ...showPopUp, update: true });
                    }}
                    width={30}
                    height={30}
                    viewBox="0 0 512 512"
                  >
                    <path d="M441 58.9L453.1 71c9.4 9.4 9.4 24.6 0 33.9L424 134.1 377.9 88 407 58.9c9.4-9.4 24.6-9.4 33.9 0zM209.8 256.2L344 121.9 390.1 168 255.8 302.2c-2.9 2.9-6.5 5-10.4 6.1l-58.5 16.7 16.7-58.5c1.1-3.9 3.2-7.5 6.1-10.4zM373.1 25L175.8 222.2c-8.7 8.7-15 19.4-18.3 31.1l-28.6 100c-2.4 8.4-.1 17.4 6.1 23.6s15.2 8.5 23.6 6.1l100-28.6c11.8-3.4 22.5-9.7 31.1-18.3L487 138.9c28.1-28.1 28.1-73.7 0-101.8L474.9 25C446.8-3.1 401.2-3.1 373.1 25zM88 64C39.4 64 0 103.4 0 152L0 424c0 48.6 39.4 88 88 88l272 0c48.6 0 88-39.4 88-88l0-112c0-13.3-10.7-24-24-24s-24 10.7-24 24l0 112c0 22.1-17.9 40-40 40L88 464c-22.1 0-40-17.9-40-40l0-272c0-22.1 17.9-40 40-40l112 0c13.3 0 24-10.7 24-24s-10.7-24-24-24L88 64z" />
                  </svg>
                  <svg
                    className="deleteBook"
                    onClick={() => {
                      setSelectedBook(book);
                      setShowPopUp({ ...showPopUp, delete: true });
                    }}
                    width={30}
                    height={30}
                    viewBox="0 0 448 512"
                  >
                    <path d="M135.2 17.7L128 32 32 32C14.3 32 0 46.3 0 64S14.3 96 32 96l384 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-96 0-7.2-14.3C307.4 6.8 296.3 0 284.2 0L163.8 0c-12.1 0-23.2 6.8-28.6 17.7zM416 128L32 128 53.2 467c1.6 25.3 22.6 45 47.9 45l245.8 0c25.3 0 46.3-19.7 47.9-45L416 128z" />
                  </svg>
                </div>
                {/* <div className="canvasContainer">
                  <BookModel />
                </div> */}
                <img
                  className="image"
                  src={book.cover?.toString() || ""}
                  alt={book.name}
                />
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
