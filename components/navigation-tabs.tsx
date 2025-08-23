"use client"

import { motion } from "framer-motion"

interface NavigationTabsProps {
  activeTab: "flows" | "spaces" | "hmmm"
  onTabChange: (tab: "flows" | "spaces" | "hmmm") => void
}

export default function NavigationTabs({ activeTab, onTabChange }: NavigationTabsProps) {
  return (
    <motion.div
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.1, duration: 0.6 }}
      className="fixed top-0 right-8 z-20 pt-4"
    >
      <div className="flex items-center space-x-8">
        {(["flows", "spaces", "hmmm"] as const).map((tab) => (
          <motion.button
            key={tab}
            onClick={() => onTabChange(tab)}
            className={`relative text-lg font-serif italic transition-all duration-300 ease-out capitalize ${
              activeTab === tab ? "text-slate-800 font-medium" : "text-slate-400"
            }`}
            whileHover={{
              scale: 1.05,
              color: "#1e293b", // slate-800
              transition: { duration: 0.2, ease: "easeOut" },
            }}
            whileTap={{
              scale: 0.95,
              transition: { duration: 0.1 },
            }}
          >
            <motion.div
              className="absolute -bottom-1 left-0 h-0.5 bg-amber-400 rounded-full"
              initial={{ width: 0 }}
              whileHover={{
                width: "100%",
                transition: { duration: 0.3, ease: "easeOut" },
              }}
            />
            {tab === "flows" ? "Flows" : tab === "spaces" ? "Spaces" : "Hmm"}
          </motion.button>
        ))}
      </div>
    </motion.div>
  )
}
