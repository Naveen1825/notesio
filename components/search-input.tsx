"use client"

import { motion } from "framer-motion"

interface SearchInputProps {
  searchQuery: string
  onSearchChange: (query: string) => void
}

export default function SearchInput({ searchQuery, onSearchChange }: SearchInputProps) {
  return (
    <motion.div
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.2, duration: 0.6 }}
      className="mb-8"
    >
      <div className="flex-1 max-w-md pt-4">
        <input
          type="text"
          placeholder="Search from my thoughts"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="text-5xl font-serif italic bg-transparent border-none outline-none placeholder:text-slate-400 text-slate-600 font-light border-slate-200 pb-2 pt-0 my-0 mt-3.5 border-b pr-0 mr-0 w-auto"
        />
      </div>
    </motion.div>
  )
}
