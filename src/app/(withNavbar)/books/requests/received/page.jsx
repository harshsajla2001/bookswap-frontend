"use client";

import { useEffect, useState } from "react";
import { API } from "@/api";
import ProtectedRoute from "@/components/ProtectedRoute";
import Loader from "@/components/Loader";
import { motion } from "framer-motion";
import { CheckCircle, Clock, XCircle, BookOpen } from "lucide-react";

export default function ReceivedRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);

  const fetchReceived = async () => {
    try {
      const res = await API.get("/requests/received");
      setRequests(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id, status) => {
    try {
      setActionLoading(id);
      await API.put(`/requests/${id}/status`, { status });
      setRequests((prev) =>
        prev.map((r) => (r._id === id ? { ...r, status } : r))
      );
    } catch (err) {
      console.error(err);
      alert("Error updating request");
    } finally {
      setActionLoading(null);
    }
  };

  useEffect(() => {
    fetchReceived();
  }, []);

  if (loading) return <Loader />;

  return (
    <ProtectedRoute>
      <div className="p-6"> <h1 className="text-3xl font-bold mb-6 text-blue-600"> Received Requests </h1>

        {requests.length === 0 ? (
          <p className="text-gray-500 text-lg text-center">
            No received requests yet.
          </p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {requests.map((r) => {
              const statusColor =
                r?.status === "Pending"
                  ? "bg-yellow-100 text-yellow-700 border-yellow-300"
                  : r?.status === "Accepted"
                    ? "bg-green-100 text-green-700 border-green-300"
                    : "bg-red-100 text-red-700 border-red-300";

              const statusIcon =
                r.status === "Pending" ? (
                  <Clock size={18} />
                ) : r?.status === "Accepted" ? (
                  <CheckCircle size={18} />
                ) : (
                  <XCircle size={18} />
                );

              return (
                <motion.div
                  key={r._id}
                  className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 p-6 flex flex-col justify-between"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                >
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <BookOpen className="text-blue-500" size={20} />
                      <p className="text-lg font-semibold text-gray-800">
                        {r.book?.title}
                      </p>
                    </div>

                    <p className="text-gray-600">
                      <span className="text-blue-600 font-medium">From:</span>{" "}
                      {r.requester?.name}
                    </p>

                    {/* Status */}
                    <div
                      className={`mt-4 flex items-center gap-2 px-3 py-2 rounded-lg border ${statusColor}`}
                    >
                      {statusIcon}
                      <span className="font-semibold capitalize">
                        {r?.status}
                      </span>
                    </div>
                  </div>

                  {/* Dropdown */}
                  <div className="mt-6">
                    <label className="block text-sm text-gray-700 font-medium mb-2">
                      Update Status
                    </label>
                    <select
                      disabled={actionLoading === r._id}
                      value={r.status}
                      onChange={(e) =>
                        handleStatusChange(r._id, e.target.value)
                      }
                      className="w-full border border-gray-300 rounded-xl p-2.5 outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 transition-all"
                    >
                      <option value="">Pending</option>
                      <option value="Accepted">Accepted</option>
                      <option value="Declined">Declined</option>
                    </select>

                    {actionLoading === r._id && (
                      <p className="text-sm text-blue-500 mt-2 animate-pulse">
                        Updating...
                      </p>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}
