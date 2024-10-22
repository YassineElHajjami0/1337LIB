import React, { Dispatch, SetStateAction, useState } from "react";

type BookData = {
  id: number | null;
  name: string;
  author: string;
  description: string;
  cover: string | File | null; // Accept both string (for URL) or File
  category: string | null;
  availability: boolean | undefined;
};

const PopUpDelete = ({
  setShowPopUp,
  book,
}: {
  setShowPopUp: Dispatch<
    SetStateAction<{
      create: boolean;
      update: boolean;
      delete: boolean;
    }>
  >;
  book: BookData | null;
}) => {
  const [disabledBtn, setDisabledBtn] = useState(false);
  const [showResponse, setShowResponse] = useState({
    success: false,
    message: "",
  });
  const handleDelete = async () => {
    try {
      setDisabledBtn(true);
      const response = await fetch(`/api`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: book?.id }), // Send the book ID in the request body
      });

      if (!response.ok) {
        throw new Error("Failed to delete the book");
      }
      setShowResponse({
        success: true,
        message: "Book deleted successfully.",
      });
      console.log(`Book with ID ${book?.id} deleted successfully.`);
      setTimeout(() => {
        setShowPopUp({ create: false, update: false, delete: false });
      }, 2000);
    } catch (error) {
      console.error("Error deleting the book:", error);
      setDisabledBtn(false);
      setShowResponse({
        success: false,
        message: "Failed to delete the book.",
      });
    }
  };

  return (
    <>
      <div className="backgroundDark"></div>

      <div className="popUpDelete">
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
        <h2>Delete Book</h2>
        <p>Are you sure you want to delete this book?</p>

        <div>
          <button
            className="delete"
            disabled={disabledBtn}
            onClick={handleDelete}
          >
            Delete
          </button>
          <button
            className="cancel"
            onClick={() =>
              setShowPopUp({ create: false, update: false, delete: false })
            }
          >
            Cancel
          </button>
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

export default PopUpDelete;
