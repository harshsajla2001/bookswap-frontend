"use client";

import Link from "next/link";
import { useContext, useState } from "react";
import { usePathname } from "next/navigation";
import { AuthContext } from "../context/AuthContext";
import { User, Menu, X } from "lucide-react";

export default function Navbar() {
    const { user, logout } = useContext(AuthContext);
    const pathname = usePathname();
    const [openMenu, setOpenMenu] = useState(false);

    const isActive = (path) =>
        pathname === path
            ? "text-blue-600 font-semibold"
            : "text-gray-700 hover:text-blue-600";

    return (
        <>
            {/* Navbar */}
            <nav className="bg-white shadow-md py-3 px-6 flex justify-between items-center relative z-50">
                <Link href="/" className="text-2xl font-bold text-blue-600">
                    BookSwap
                </Link>

                {/* Desktop Menu */}
                <div className="hidden md:flex items-center gap-6">
                    {user ? (
                        <>
                            <Link href="/books" className={isActive("/books")}>
                                All Books
                            </Link>
                            <Link href="/books/my" className={isActive("/books/my")}>
                                My Books
                            </Link>
                            <Link href="/books/requests/sent" className={isActive("/books/requests/sent")}>
                                Sent Requests
                            </Link>
                            <Link href="/books/requests/received" className={isActive("/books/requests/received")}>
                                Received Requests
                            </Link>

                            <div className="flex items-center gap-2 border-l pl-4">
                                <User className="w-5 h-5 text-blue-600" />
                                <span className="font-medium text-gray-800">{user?.name || "User"}</span>
                            </div>

                            <button
                                onClick={logout}
                                className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                            >
                                Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <Link href="/login" className={isActive("/login")}>
                                Login
                            </Link>
                            <Link
                                href="/register"
                                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                            >
                                Get Started
                            </Link>
                        </>
                    )}
                </div>

                {/* Mobile Hamburger */}
                <button className="md:hidden" onClick={() => setOpenMenu(!openMenu)}>
                    {openMenu ? <X size={28} /> : <Menu size={28} />}
                </button>
            </nav>

            {/* Mobile Menu */}
            {openMenu && (
                <div className="absolute top-[56px] left-0 w-full bg-white shadow-lg py-4 px-6 flex flex-col gap-4 z-40 border-t md:hidden">
                    {user ? (
                        <>
                            <Link href="/books" className={isActive("/books")} onClick={() => setOpenMenu(false)}>
                                All Books
                            </Link>
                            <Link href="/books/my" className={isActive("/books/my")} onClick={() => setOpenMenu(false)}>
                                My Books
                            </Link>
                            <Link
                                href="/books/requests/sent"
                                className={isActive("/books/requests/sent")}
                                onClick={() => setOpenMenu(false)}
                            >
                                Sent Requests
                            </Link>
                            <Link
                                href="/books/requests/received"
                                className={isActive("/books/requests/received")}
                                onClick={() => setOpenMenu(false)}
                            >
                                Received Requests
                            </Link>

                            <div className="flex items-center gap-2 mt-2">
                                <User className="w-5 h-5 text-blue-600" />
                                <span className="font-medium text-gray-800">{user?.name}</span>
                            </div>

                            <button
                                onClick={() => {
                                    logout();
                                    setOpenMenu(false);
                                }}
                                className="bg-red-500 text-white px-3 py-2 rounded hover:bg-red-600"
                            >
                                Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <Link href="/login" className={isActive("/login")} onClick={() => setOpenMenu(false)}>
                                Login
                            </Link>
                            <Link
                                href="/register"
                                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                                onClick={() => setOpenMenu(false)}
                            >
                                Get Started
                            </Link>
                        </>
                    )}
                </div>
            )}
        </>
    );
}
