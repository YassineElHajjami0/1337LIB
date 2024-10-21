import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import "./globals.css";

type Category = {
  id: number;
  name: string;
};

interface BookData {
  name: string;
  author: string;
  description: string;
  category: number | null;
  file: File | null;
}

const PopUpCreate = ({
  setShowPopUp,
}: {
  setShowPopUp: Dispatch<SetStateAction<boolean>>;
}) => {
  const [bookData, setBookData] = useState<BookData>({
    name: "",
    author: "",
    description: "",
    category: null,
    file: null,
  });
  const [categories, setCategories] = useState<Category[]>([]);
  const [showResponse, setShowResponse] = useState({
    success: false,
    message: "",
  });
  // Fetch categories from an API endpoint when the component mounts
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

  // Handle input change for text inputs
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setBookData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle category selection change
  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedCategory = Number(e.target.value);
    setBookData((prevData) => ({
      ...prevData,
      category: selectedCategory,
    }));
  };

  // Handle file upload and validation
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = e.target.files?.[0];
    if (
      uploadedFile &&
      ["image/png", "image/jpg", "image/jpeg"].includes(uploadedFile.type)
    ) {
      setBookData((prevData) => ({
        ...prevData,
        file: uploadedFile,
      }));
    } else {
      alert("Please upload a valid image file (.png, .jpg, .jpeg)");
      setBookData((prevData) => ({
        ...prevData,
        file: null,
      }));
    }
  };

  // Add book logic
  const handleAddBook = async () => {
    const { name, author, description, category, file } = bookData;

    if (!name || !author || !description || !category || !file) {
      setShowResponse({
        success: false,
        message: "Please fill in all fields.",
      });
      return;
    }

    // Prepare the form data to send to the server
    const formData = new FormData();
    formData.append("name", name);
    formData.append("author", author);
    formData.append("description", description);
    formData.append("category", String(category));
    formData.append("file", file);

    console.log("FORM DATA:", formData);

    try {
      const response = await fetch("/api", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        // Reset form fields after successful submission
        setBookData({
          name: "",
          author: "",
          description: "",
          category: null,
          file: null,
        });
        setShowResponse({ success: true, message: "Book added successfully." });
        setTimeout(() => {
          setShowPopUp(false);
        }, 2000);
      } else {
        setShowResponse({ success: false, message: "Failed to add book." });
      }
    } catch (error) {
      setShowResponse({ success: false, message: "Failed to add book." });
    }
  };

  return (
    <>
      <div className="backgroundDark"></div>
      <div className="popUpCreate">
        <div className="closeBtn">
          <svg
            fill="#fff"
            width={32}
            height={32}
            onClick={() => setShowPopUp(false)}
            viewBox="0 0 384 512"
          >
            <path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z" />
          </svg>
        </div>
        <h2>
          Add Book{" "}
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
            required
            value={bookData.category || ""}
            onChange={handleCategoryChange}
          >
            <option value="all">all</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
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

        <div className="addBook" onClick={handleAddBook}>
          Add
        </div>
        {showResponse.message !== "" && (
          <h3 className={showResponse.success ? "success" : "error"}>
            {showResponse.message}
          </h3>
        )}
      </div>
    </>
  );
};

export default PopUpCreate;
