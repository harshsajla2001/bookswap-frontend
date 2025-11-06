"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 to-white text-gray-800">
      
      {/* Hero Section */}
      <main className="flex flex-col-reverse md:flex-row items-center justify-between px-6 md:px-20 py-16 md:py-24">
        {/* Left Text */}
        <motion.div
          className="w-full md:w-1/2"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Exchange Books, Expand Horizons 📚
          </h2>
          <p className="text-lg text-gray-600 mb-8 leading-relaxed">
            Welcome to <span className="font-semibold text-blue-600">BookSwap</span> —
            a platform where book lovers exchange, discover, and share knowledge together.
            Save money, meet readers, and give your books a new home.
          </p>
          <div className="flex gap-4">
            <Link
              href="/register"
              className="bg-blue-600 text-white px-5 py-3 rounded-lg shadow hover:bg-blue-700"
            >
              Join Now
            </Link>
            <Link
              href="/login"
              className="border border-blue-600 text-blue-600 px-5 py-3 rounded-lg hover:bg-blue-50"
            >
              Login
            </Link>
          </div>
        </motion.div>
      </main>

      {/* Features Section */}
      <section className="px-6 md:px-20 py-16 bg-white">
        <h3 className="text-3xl font-bold text-center mb-12 text-gray-800">
          Why Choose BookSwap?
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            {
              title: "Trade Your Books",
              desc: "Easily swap books you’ve already read with others who share your interests.",
              icon: "📖",
            },
            {
              title: "Discover New Reads",
              desc: "Find books from different genres and explore unique perspectives.",
              icon: "🌍",
            },
            {
              title: "Connect with Readers",
              desc: "Build connections with people who share your reading passion.",
              icon: "🤝",
            },
          ].map((item, i) => (
            <motion.div
              key={i}
              className="bg-blue-50 rounded-2xl p-6 text-center shadow-sm hover:shadow-md transition"
              whileHover={{ scale: 1.05 }}
            >
              <div className="text-4xl mb-4">{item.icon}</div>
              <h4 className="text-xl font-semibold mb-2">{item.title}</h4>
              <p className="text-gray-600">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto bg-blue-600 text-white text-center py-6">
        <p>
          © {new Date().getFullYear()} BookSwap — Built by{" "}
          <span className="font-semibold">Harsh Sajla</span>
        </p>
      </footer>
    </div>
  );
}
