"use client"

import { motion } from "framer-motion"
import { Moon, Sparkles, Settings } from "lucide-react"

export default function Sidebar() {
  return (
    <motion.aside
      initial={{ x: -80, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="fixed left-0 top-0 h-full w-20 flex flex-col items-center py-8 space-y-8 bg-white/20 backdrop-blur-xl z-10 shadow-orange-100/20 border-2 shadow-xl border-t-0 border-l-0 border-b-0 rounded-3xl border-slate-200 border-r-0"
    >
      <div className="flex-1" />
      <motion.div
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.6, staggerChildren: 0.1 }}
        className="flex flex-col space-y-6 text-slate-600"
      >
        <div className="text-xs font-medium text-slate-600 hover:text-orange-600 transition-colors cursor-pointer">
          Notes
        </div>
        <div>
          <Moon className="hover:text-orange-600 transition-colors cursor-pointer h-7 w-7" />
        </div>
        <div>
          <Sparkles className="hover:text-orange-600 transition-colors cursor-pointer w-7 h-7" />
        </div>
        <div>
          <Settings className="hover:text-orange-600 transition-colors cursor-pointer w-7 h-7" />
        </div>
      </motion.div>
    </motion.aside>
  )
}
