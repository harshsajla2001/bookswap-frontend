"use client";

import { useEffect, useState } from "react";
import { API } from "@/api";
import ProtectedRoute from "@/components/ProtectedRoute";
import Loader from "@/components/Loader";
import { motion } from "framer-motion";

export default function page() {
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

    const handleAction = async (id, status) => {
        try {
            setActionLoading(id);
            await API.put(`/requests/${id}/status`, { status });
            setRequests(
                requests.map((r) => (r._id === id ? { ...r, status } : r))
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
            <div className="p-6">
                <h1 className="text-2xl font-bold mb-6 text-blue-600">
                    Received Requests
                </h1>

                {requests.length === 0 ? (
                    <p className="text-gray-500 text-lg">No received requests yet.</p>
                ) : (
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {requests.map((r) => (
                            <motion.div
                                key={r._id}
                                className="bg-white rounded-2xl shadow-md p-5 hover:shadow-xl transition"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.4 }}
                            >
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
                                <p className="mt-2">
                                    <span className="font-semibold">Status:</span>{" "}
                                    <span
                                        className={`${r.status === "pending"
                                            ? "text-yellow-600"
                                            : r.status === "accepted"
                                                ? "text-green-600"
                                                : "text-red-600"
                                            } font-medium`}
                                    >
                                        {r.status}
                                    </span>
                                </p>

                                {r.status === "pending" && actionLoading !== r._id && (
                                    <div className="mt-4 flex gap-3">
                                        <button
                                            onClick={() => handleAction(r._id, "accepted")}
                                            disabled={actionLoading === r._id}
                                            className="flex-1 bg-green-600 text-white py-2 rounded-xl font-medium hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            {actionLoading === r._id ? "Processing..." : "Accept"}
                                        </button>
                                        <button
                                            onClick={() => handleAction(r._id, "declined")}
                                            disabled={actionLoading === r._id}
                                            className="flex-1 bg-red-600 text-white py-2 rounded-xl font-medium hover:bg-red-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            {actionLoading === r._id ? "Processing..." : "Cancel"}
                                        </button>
                                    </div>
                                )}
                                {actionLoading === r._id && (
                                    <div className="mt-4">
                                        <p className="text-sm text-blue-600 font-medium animate-pulse">
                                            Updating request...
                                        </p>
                                    </div>
                                )}
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </ProtectedRoute>
    );
}
