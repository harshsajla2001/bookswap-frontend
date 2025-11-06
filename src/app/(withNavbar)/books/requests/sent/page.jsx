"use client";

import { useEffect, useState } from "react";
import { API } from "@/api";
import ProtectedRoute from "@/components/ProtectedRoute";
import Loader from "@/components/Loader";
import { motion } from "framer-motion";
import { CheckCircle, Clock, XCircle, BookOpen } from "lucide-react";


export default function SentRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchSent = async () => {
    try {
      const res = await API.get("/requests/sent");
      setRequests(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSent();
  }, []);

  if (loading) return <Loader />;

  return (
    <ProtectedRoute>
      <div className="p-6 min-h-screen bg-gray-50">
        <h1 className="text-2xl font-bold mb-6 text-blue-600">
          Sent Requests
        </h1>

        {requests.length === 0 ? (
          <div className="text-center mt-20 text-gray-500 text-lg">
            <p>No requests sent yet.</p>
          </div>
        ) : (
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {requests.map((r, i) => (
              <motion.div
                key={r._id}
                className="bg-white rounded-2xl shadow-md p-5 hover:shadow-xl transition transform hover:-translate-y-1"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
              >
                {/* Book Info */}
                <div className="border-b pb-3 mb-3">
                  <div className="flex items-center gap-2 mb-3">
                    <BookOpen className="text-blue-500" size={20} />
                    <p className="text-lg font-semibold text-gray-800">
                      {r.book?.title}
                    </p>
                  </div>
                  <p className="text-gray-600 mt-1">
                    <span className="text-blue-600 font-medium">Owner:</span>{" "}
                    {r.owner?.name || "Unknown"}
                  </p>
                </div>

                {/* Status */}
                <div className="mt-2">
                  <span className="font-semibold text-gray-700">Status: </span>
                  <span
                    className={`font-medium px-2 py-1 rounded-md ${r.status === "Pending"
                      ? "bg-yellow-100 text-yellow-700"
                      : r.status === "Accepted"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                      }`}
                  >
                    {r.status}
                  </span>
                </div>

                {/* Optional: Timestamp */}
                {r.createdAt && (
                  <p className="text-sm text-gray-500 mt-2">
                    Sent on{" "}
                    {new Date(r.createdAt).toLocaleDateString("en-IN", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </p>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}
