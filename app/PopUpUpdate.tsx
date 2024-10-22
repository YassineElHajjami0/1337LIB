import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import "./globals.css";

type Category = {
  id: number;
  name: string;
};

type BookData = {
  id: number | null;
  name: string;
  author: string;
  description: string;
  cover: string | File | null; // Accept both string (for URL) or File
  category: string | null;
  availability: boolean | undefined;
};

const PopUpUpdate = ({
  setBooks,
  setShowPopUp,
  book,
}: {
  setBooks: Dispatch<SetStateAction<BookData[]>>;

  setShowPopUp: Dispatch<
    SetStateAction<{
      create: boolean;
      update: boolean;
      delete: boolean;
    }>
  >;
  book: BookData | null;
}) => {
  const [bookData, setBookData] = useState<BookData>({
    id: book?.id || null,
    name: book?.name || "",
    author: book?.author || "",
    description: book?.description || "",
    category: book?.category || null,
    cover: book?.cover || null, // Use the existing cover if available
    availability: book?.availability,
  });
  console.log("BOOK:", bookData);

  const [categories, setCategories] = useState<Category[]>([]);
  const [showResponse, setShowResponse] = useState({
    success: false,
    message: "",
  });
  const [disabledBtn, setDisabledBtn] = useState(false);

  useEffect(() => {
    async function fetchCategories() {
      try {
        const response = await fetch("/api/categories");
        const data = await response.json();
        setCategories(data);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      }
    }
    fetchCategories();
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setBookData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedCategory = e.target.value; // This is now a string
    setBookData((prevData) => ({
      ...prevData,
      category: selectedCategory, // Update to use the string directly
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = e.target.files?.[0];
    if (
      uploadedFile &&
      ["image/png", "image/jpg", "image/jpeg"].includes(uploadedFile.type)
    ) {
      setBookData((prevData) => ({
        ...prevData,
        cover: uploadedFile, // No need for an array, just store the file itself
      }));
    } else {
      alert("Please upload a valid image file (.png, .jpg, .jpeg)");
    }
  };

  const handleUpdateBook = async () => {
    const { name, author, description, category, cover } = bookData;

    if (!name || !author || !description || !categories) {
      setShowResponse({
        success: false,
        message: "Please fill in all fields.",
      });
      return;
    }

    setDisabledBtn(true);
    const formData = new FormData();

    if (bookData.id) {
      formData.append("id", String(bookData.id));
    }
    formData.append("name", name);
    formData.append("author", author);
    formData.append("description", description);
    formData.append("category", String(categories));
    if (cover instanceof File) {
      formData.append("file", cover); // Only append if the cover is a new file
    }

    try {
      const response = await fetch("/api", {
        method: "PUT", // Assuming you're doing an update here
        body: formData,
      });

      if (response.ok) {
        setBooks((prevBooks) => {
          const updatedBooks = prevBooks.map((book) => {
            if (book.id === bookData.id) {
              return {
                ...book,
                name: bookData.name,
                author: bookData.author,
                description: bookData.description,
                category: bookData.category,
                cover: bookData.cover,
              };
            }
            return book;
          });
          return updatedBooks;
        });
        setBookData({
          id: null,
          name: "",
          author: "",
          description: "",
          category: null,
          cover: null,
          availability: undefined,
        });
        setShowResponse({
          success: true,
          message: "Book updated successfully.",
        });
        setTimeout(() => {
          setShowPopUp({ create: false, update: false, delete: false });
        }, 2000);
      } else {
        setDisabledBtn(false);
        setShowResponse({ success: false, message: "Failed to update book." });
      }
    } catch (error) {
      setDisabledBtn(false);
      setShowResponse({ success: false, message: "Failed to update book." });
    }
  };

  return (
    <>
      <div className="backgroundDark"></div>
      <div className="popUpUpdate">
        <div className="closeBtn">
          <svg
            fill="#fff"
            width={32}
            height={32}
            onClick={() =>
              setShowPopUp({ create: false, update: false, delete: false })
            }
            viewBox="0 0 384 512"
          >
            <path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z" />
          </svg>
        </div>
        <h2>
          Edit Book{" "}
          <svg width={25} height={25} fill="#fff" viewBox="0 0 448 512">
            <path d="M96 0C43 0 0 43 0 96L0 416c0 53 43 96 96 96l288 0 32 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l0-64c17.7 0 32-14.3 32-32l0-320c0-17.7-14.3-32-32-32L384 0 96 0zm0 384l256 0 0 64L96 448c-17.7 0-32-14.3-32-32s14.3-32 32-32zm32-240c0-8.8 7.2-16 16-16l192 0c8.8 0 16 7.2 16 16s-7.2 16-16 16l-192 0c-8.8 0-16-7.2-16-16zm16 48l192 0c8.8 0 16 7.2 16 16s-7.2 16-16 16l-192 0c-8.8 0-16-7.2-16-16s7.2-16 16-16z" />
          </svg>
        </h2>
        <div>
          <label>Name</label>
          <input
            required
            type="text"
            placeholder="name"
            name="name"
            value={bookData.name}
            onChange={handleInputChange}
          />
        </div>

        <div>
          <label>Author</label>
          <input
            required
            type="text"
            name="author"
            placeholder="author"
            value={bookData.author}
            onChange={handleInputChange}
          />
        </div>

        <div className="area">
          <label>Description</label>
          <textarea
            required
            name="description"
            placeholder="description"
            value={bookData.description}
            onChange={handleInputChange}
          />
        </div>

        <div>
          <label>Category</label>
          <select
            name="category"
            value={bookData.category || ""}
            onChange={handleCategoryChange}
          >
            <option value="">Select Category</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.name}>
                {" "}
                {/* Ensure this value corresponds to the category string */}
                {cat.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label>Cover</label>
          <input
            required
            type="file"
            accept=".png,.jpg,.jpeg"
            onChange={handleFileChange}
          />
        </div>

        <div
          className={disabledBtn ? "addBook disabled" : "addBook"}
          onClick={handleUpdateBook}
        >
          Update
        </div>
        <div className="response">
          {showResponse.message !== "" && (
            <h3 className={showResponse.success ? "success" : "error"}>
              {showResponse.message}
            </h3>
          )}
        </div>
      </div>
    </>
  );
};

export default PopUpUpdate;
