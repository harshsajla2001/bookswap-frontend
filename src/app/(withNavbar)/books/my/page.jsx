"use client";

import { useEffect, useState } from "react";
import { API } from "@/api";
import ProtectedRoute from "../../../../components/ProtectedRoute";
import Loader from "../../../../components/Loader";
import { motion } from "framer-motion";
import Image from "next/image";


export default function MyBooks() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [newBook, setNewBook] = useState({
    title: "",
    author: "",
    condition: "",
    image: null,
  });


  const fetchMyBooks = async () => {
    try {
      const res = await API.get("/books/my");
      setBooks(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };



  const handleDelete = async (id) => {
    if (!confirm("Are you sure?")) return;
    await API.delete(`/books/${id}`);
    setBooks(books.filter((b) => b._id !== id));
  };

  useEffect(() => {
    fetchMyBooks();
  }, []);

  if (loading) return <Loader />;


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
      fetchMyBooks();
    } catch (err) {
      console.error(err);
      alert("Error creating book");
    }
  };

  return (
    <ProtectedRoute>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-blue-600">My Books</h1>
          <button
            onClick={() => setShowModal(true)}
            className="bg-blue-600 text-white px-5 py-2 rounded-xl hover:bg-blue-700 transition"
          >
            Add Book
          </button>

        </div>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {books?.map((book) => (
            <div key={book?._id} className="bg-white shadow p-4 rounded-lg">
              <Image
                src={`http://localhost:8080${book?.image}`}
                alt={book?.title}
                width={300}
                height={200}
                className="w-full h-50 object-cover rounded-md"
              />
              <h2 className="text-lg font-bold mt-2">{book?.title}</h2>
              <p className="text-sm text-gray-600">{book?.author}</p>
              <p className="text-xs text-gray-500 mb-2">
                Condition: {book?.condition}
              </p>
              <button
                onClick={() => handleDelete(book?._id)}
                className="bg-red-500 text-white py-1 px-3 rounded hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          ))}
        </div>

        {/* Create Book Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black/50  flex items-center justify-center z-10">
            <div className="bg-white p-6 rounded-2xl w-full max-w-md shadow-xl">
              {/* <motion.div
              className="bg-white p-6 rounded-2xl w-full max-w-md shadow-xl"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1 }}
            > */}
              <h2 className="text-2xl font-bold mb-4 text-blue-600">
                Add New Book
              </h2>
              <form className="space-y-3" onSubmit={handleCreateBook}>
                <input
                  type="text"
                  placeholder="Title"
                  value={newBook.title}
                  onChange={(e) =>
                    setNewBook({ ...newBook, title: e.target.value })
                  }
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
                  required
                />
                <input
                  type="text"
                  placeholder="Author"
                  value={newBook.author}
                  onChange={(e) =>
                    setNewBook({ ...newBook, author: e.target.value })
                  }
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
                  required
                />
                <input
                  type="text"
                  placeholder="Condition"
                  value={newBook.condition}
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

              {/* </motion.div> */}
            </div>
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}
