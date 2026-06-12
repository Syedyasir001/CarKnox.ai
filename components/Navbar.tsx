"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export default function Navbar() {
  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="fixed top-0 left-0 right-0 z-50 bg-[#0f0f0f]/80 backdrop-blur-md border-b border-[#0f1629]"
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0 flex items-center font-bebas text-4xl tracking-tight select-none" aria-label="CarKnox - AI-powered car analysis">
            <span className="text-white font-black">Car</span>
            <span
              className="font-black bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-400"
              style={{ filter: "drop-shadow(0 0 8px rgba(56,189,248,0.6))" }}
            >Knox</span>
          </Link>

          {/* Right side navigation */}
          <div className="flex items-center gap-3">
            <a
              href="/dealerships"
              className="px-5 py-2 rounded-full bg-[#1a1a2e] text-white text-sm font-medium hover:bg-[#252545] transition-colors"
            >
              Dealerships
            </a>
            <a
              href="/dealerships/dashboard"
              className="px-5 py-2 rounded-full bg-[#1a1a2e] text-white text-sm font-medium hover:bg-[#252545] transition-colors"
            >
              Owner Portal
            </a>
          </div>
        </div>
      </div>
    </motion.nav>
  );
}
