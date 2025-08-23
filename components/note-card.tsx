"use client"

import React, { useMemo } from "react"
import { motion } from "framer-motion"
import { Edit3, X, PenTool } from "lucide-react"

interface Note {
  id: number
  title: string
  content: string
  createdAt: Date
}

interface NoteCardProps {
  note: Note
  index: number
  onNoteClick: (note: Note) => void
  onEditNote: (note: Note) => void
  onDeleteNote: (id: number) => void
  parsedContent: string
  onEditDrawing?: (drawingData: string, newDrawingData: string) => void
}

const NoteCard = React.memo<NoteCardProps>(({ 
  note, 
  index, 
  onNoteClick, 
  onEditNote, 
  onDeleteNote, 
  parsedContent, 
  onEditDrawing 
}) => {
  const renderedContent = useMemo(() => {
    // Split content by drawing blocks
    const parts = note.content.split(/```drawing\n([\s\S]*?)\n```/)
    const elements: React.ReactNode[] = []
    let hasContent = false
    
    for (let i = 0; i < parts.length; i++) {
      if (i % 2 === 0) {
        // Regular text content
        const textContent = parts[i].trim()
        if (textContent) {
          hasContent = true
          // Apply basic markdown formatting and truncate for preview
          let formattedContent = textContent
            .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold">$1</strong>')
            .replace(/\*(.*?)\*/g, '<em class="italic">$1</em>')
            .replace(/`([^`]+)`/g, '<code class="bg-slate-200/70 px-1 py-0.5 rounded text-xs font-mono">$1</code>')
            .replace(/^#{1,3}\s+(.+)$/gm, '<strong class="font-semibold text-slate-800">$1</strong>')
            .replace(/\n/g, ' ')
          
          // Truncate long content
          if (formattedContent.length > 200) {
            formattedContent = formattedContent.substring(0, 200) + '...'
          }
          
          elements.push(
            <div
              key={`text-${i}`}
              className="text-slate-700 leading-relaxed mb-3 line-clamp-3 font-sans"
              dangerouslySetInnerHTML={{ __html: formattedContent }}
            />
          )
        }
      } else {
        // Drawing block - show as indicator
        hasContent = true
        elements.push(
          <div key={`drawing-${i}`} className="my-3">
            <div className="flex items-center space-x-2 text-sm text-slate-500 bg-slate-100/70 px-3 py-2 rounded-lg border border-slate-200/80">
              <PenTool className="w-4 h-4 text-slate-400" />
              <span className="font-medium">Drawing {Math.floor(i / 2) + 1}</span>
              <span className="text-xs text-slate-400">• Interactive content</span>
            </div>
          </div>
        )
      }
    }
    
    // If no content found, show placeholder
    if (!hasContent || elements.length === 0) {
      elements.push(
        <div key="empty" className="text-slate-400 italic font-sans">
          No content available
        </div>
      )
    }
    
    return elements
  }, [note.content])

  // Count drawings and text sections for the summary
  const contentSummary = useMemo(() => {
    const drawingMatches = note.content.match(/```drawing\n([\s\S]*?)\n```/g) || []
    const textContent = note.content.replace(/```drawing\n([\s\S]*?)\n```/g, '').trim()
    
    const drawingCount = drawingMatches.length
    const hasText = textContent.length > 0
    
    if (drawingCount > 0 && hasText) {
      return `${drawingCount} drawing${drawingCount > 1 ? 's' : ''} • Text content`
    } else if (drawingCount > 0) {
      return `${drawingCount} drawing${drawingCount > 1 ? 's' : ''} only`
    } else if (hasText) {
      return 'Text content only'
    } else {
      return 'Empty note'
    }
  }, [note.content])

  return (
    <motion.div
      key={note.id}
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{
        duration: 0.3,
        delay: index * 0.05,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
      className="group relative glass-card rounded-3xl p-8 cursor-pointer hover:shadow-xl transition-all duration-300 hover:scale-[1.02]"
      onClick={() => onNoteClick(note)}
    >
      {/* Action buttons */}
      <div className="absolute top-4 right-4 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          transition={{ type: "spring", stiffness: 700, damping: 25, mass: 0.5 }}
          onClick={(e) => {
            e.stopPropagation()
            onEditNote(note)
          }}
          className="text-slate-400 hover:text-orange-600 transition-colors duration-150 p-1 rounded-lg hover:bg-white/50"
        >
          <Edit3 className="w-4 h-4" />
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          transition={{ type: "spring", stiffness: 700, damping: 25, mass: 0.5 }}
          onClick={(e) => {
            e.stopPropagation()
            onDeleteNote(note.id)
          }}
          className="text-slate-400 hover:text-red-600 transition-colors duration-150 p-1 rounded-lg hover:bg-white/50"
        >
          <X className="w-4 h-4" />
        </motion.button>
      </div>

      {/* Note title */}
      <h3 className="text-xl font-medium text-slate-800 mb-4 pr-16 font-sans">
        {note.title}
      </h3>
      
      {/* Content summary badge */}
      <div className="mb-4">
        <span className="inline-flex items-center px-3 py-1 text-xs font-medium bg-slate-100/80 text-slate-600 rounded-full border border-slate-200/80">
          {contentSummary}
        </span>
      </div>
      
      {/* Content preview */}
      <div className="space-y-2 mb-6">
        {renderedContent}
      </div>
      
      {/* Creation date */}
      <div className="text-xs text-amber-600 font-medium">
        {note.createdAt.toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric'
        })}
      </div>

      {/* Hover indicator */}
      <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-60 transition-opacity duration-200">
        <div className="text-xs text-slate-400 bg-white/80 px-2 py-1 rounded border border-slate-200">
          Click to view
        </div>
      </div>
    </motion.div>
  )
})

NoteCard.displayName = "NoteCard"

export default NoteCard