"use client"

import React from "react"
import { motion, AnimatePresence } from "framer-motion"

interface SlashCommand {
  id: string
  label: string
  description?: string
  icon?: React.ReactNode | string
  insert?: string
}

interface SlashMenuProps {
  isVisible: boolean
  commands: SlashCommand[]
  selectedIndex: number
  onCommandSelect: (command: SlashCommand) => void
}

const SlashMenu = React.memo<SlashMenuProps>(({ 
  isVisible, 
  commands, 
  selectedIndex, 
  onCommandSelect 
}) => {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 4 }}
          transition={{ duration: 0.12, ease: "easeOut" }}
          className="absolute top-20 left-0 bg-white border border-slate-200 rounded-lg shadow-lg min-w-[280px] max-h-[300px] overflow-y-auto z-60"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="py-2">
            {commands.map((command, index) => (
              <motion.div
                key={command.id || index}
                className={`flex items-center px-4 py-2.5 cursor-pointer transition-colors ${
                  index === selectedIndex ? "bg-slate-100 text-slate-900" : "text-slate-700 hover:bg-slate-50"
                }`}
                onClick={() => onCommandSelect(command)}
                whileHover={{ x: 2 }}
                transition={{ duration: 0.1 }}
              >
                <div className="w-8 h-8 flex items-center justify-center text-slate-500 mr-3">
                  {command.icon || '•'}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-sm text-slate-900">{command.label}</div>
                  {command.description && (
                    <div className="text-xs text-slate-500 truncate">{command.description}</div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
})

SlashMenu.displayName = "SlashMenu"

export default SlashMenu