"use client";
import { useEffect, useState } from "react";
import { API } from "@/api";
import ProtectedRoute from "../../../components/ProtectedRoute";
import Loader from "../../../components/Loader";
import { motion } from "framer-motion";
import Image from "next/image";

export default function BooksList() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [newBook, setNewBook] = useState({
    title: "",
    author: "",
    condition: "",
    image: null,
  });
  const [requestedBooks, setRequestedBooks] = useState([]); 

  const fetchBooks = async () => {
    setLoading(true);
    try {
      const res = await API.get("/books");
      setBooks(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  const handleCreateBook = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("title", newBook.title);
      formData.append("author", newBook.author);
      formData.append("condition", newBook.condition);
      formData.append("image", newBook.image);

      await API.post("/books", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setShowModal(false);
      setNewBook({ title: "", author: "", condition: "", image: null });
      fetchBooks();
    } catch (err) {
      console.error(err);
      alert("Error creating book");
    }
  };

  const handleRequestBook = async (bookId) => {
    try {
      const res = await API.post("/requests", { bookId });
      if (res.data) {
        setRequestedBooks([...requestedBooks, bookId]);
      }
    } catch (err) {
      console.error(err);
      alert("Error sending request");
    }
  };

  if (loading) return <Loader />;

  return (
    <ProtectedRoute>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-blue-600">All Books</h1>

        </div>

       <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
  {books?.map((book) => (
    <div key={book?._id} className="bg-white shadow p-4 rounded-lg">
      <Image
        src={
          book?.image
            ? `http://localhost:8080${book?.image}`
            : "/default-book.png"
        }
        alt={book?.title || "Book image"}
        width={300}
        height={200}
        className="w-full h-50 object-cover rounded-md"
      />

      <h2 className="text-lg font-semibold mt-3">{book?.title}</h2>
      <p className="text-gray-600">{book?.author}</p>
      <p className="text-sm text-gray-500">Condition: {book?.condition}</p>

      {/* ✅ Show Book Owner */}
      <p className="text-sm text-gray-700 mt-2">
        <span className="font-semibold">Owner:</span> {book?.owner?.name}
      </p>
      <p className="text-xs text-gray-500">
        {book?.owner?.email}
      </p>

      <button
        onClick={() => handleRequestBook(book?._id)}
        disabled={requestedBooks.includes(book?._id)}
        className={`w-full py-2 mt-3 rounded-xl font-medium transition ${
          requestedBooks.includes(book?._id)
            ? "bg-gray-400 text-white cursor-not-allowed"
            : "bg-blue-600 text-white hover:bg-blue-700"
        }`}
      >
        {requestedBooks.includes(book?._id)
          ? "Requested"
          : "Request Book"}
      </button>
    </div>
  ))}
</div>


        {/* Create Book Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <motion.div
              className="bg-white p-6 rounded-2xl w-full max-w-md shadow-xl"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
            >
              <h2 className="text-2xl font-bold mb-4 text-blue-600">
                Add New Book
              </h2>
              <form className="space-y-3" onSubmit={handleCreateBook}>
                <input
                  type="text"
                  placeholder="Title"
                  value={newBook?.title}
                  onChange={(e) =>
                    setNewBook({ ...newBook, title: e.target.value })
                  }
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
                  required
                />
                <input
                  type="text"
                  placeholder="Author"
                  value={newBook?.author}
                  onChange={(e) =>
                    setNewBook({ ...newBook, author: e.target.value })
                  }
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
                  required
                />
                <input
                  type="text"
                  placeholder="Condition"
                  value={newBook?.condition}
                  onChange={(e) =>
                    setNewBook({ ...newBook, condition: e.target.value })
                  }
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
                  required
                />
                <input
                  type="file"
                  onChange={(e) =>
                    setNewBook({ ...newBook, image: e.target.files[0] })
                  }
                  className="w-full p-2 border rounded-lg"
                  required
                />

                <div className="flex justify-end gap-3 mt-4">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-5 py-2 rounded-xl bg-gray-300 hover:bg-gray-400"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700"
                  >
                    Add Book
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}
