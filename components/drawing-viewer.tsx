"use client"

import React, { useState, useMemo, useEffect, useCallback } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { X, Edit3, Expand, PenTool, Image, Palette, Copy, Download } from "lucide-react"

interface DrawingViewerProps {
  drawingData: string
  onEdit?: () => void
  onDelete?: () => void
  isPreview?: boolean
}

const DrawingViewer = React.memo<DrawingViewerProps>(({ 
  drawingData, 
  onEdit, 
  onDelete, 
  isPreview = false 
}) => {
  const [isExpanded, setIsExpanded] = useState(false)
  const [thumbnailUrl, setThumbnailUrl] = useState<string | null>(null)
  const [isGeneratingThumbnail, setIsGeneratingThumbnail] = useState(false)
  const [isExportingToClipboard, setIsExportingToClipboard] = useState(false)
  const [excalidrawLoaded, setExcalidrawLoaded] = useState(false)

  // Load Excalidraw utilities
  useEffect(() => {
    const loadExcalidraw = async () => {
      try {
        await import("@excalidraw/excalidraw")
        setExcalidrawLoaded(true)
      } catch (error) {
        console.error('Failed to load Excalidraw:', error)
      }
    }
    loadExcalidraw()
  }, [])

  // Simple drawing info extraction
  const drawingInfo = useMemo(() => {
    try {
      const parsedData = JSON.parse(drawingData)
      const elements = parsedData?.elements || []
      
      const elementTypes = elements.reduce((acc: any, element: any) => {
        acc[element.type] = (acc[element.type] || 0) + 1
        return acc
      }, {})

      const colors = elements.reduce((acc: Set<string>, element: any) => {
        if (element.strokeColor && element.strokeColor !== '#000000') {
          acc.add(element.strokeColor)
        }
        if (element.backgroundColor && element.backgroundColor !== 'transparent') {
          acc.add(element.backgroundColor)
        }
        return acc
      }, new Set<string>())

      return {
        elementCount: elements.length,
        elementTypes,
        colors: Array.from(colors).slice(0, 5),
        isEmpty: elements.length === 0,
        elements: elements,
        appState: parsedData?.appState || {}
      }
    } catch (error) {
      console.error('Error parsing drawing data:', error)
      return {
        elementCount: 0,
        elementTypes: {},
        colors: [],
        isEmpty: true,
        error: true,
        elements: [],
        appState: {}
      }
    }
  }, [drawingData])

  // Generate thumbnail from drawing data
  const generateThumbnail = useCallback(async (elements: any[], appState: any = {}) => {
    if (!elements || elements.length === 0 || !excalidrawLoaded) return null
    
    try {
      setIsGeneratingThumbnail(true)
      
      const { exportToCanvas } = await import("@excalidraw/excalidraw")
      
      const exportOptions = {
        elements: elements,
        appState: {
          ...appState,
          exportBackground: true,
          viewBackgroundColor: "#ffffff",
          exportWithDarkMode: false,
          exportScale: 1,
        },
        files: null,
        maxWidthOrHeight: 400,
        exportPadding: 10,
      }
      
      const canvas = await exportToCanvas(exportOptions)
      return canvas.toDataURL('image/png', 0.8)
    } catch (error) {
      console.error('Error generating thumbnail:', error)
      return null
    } finally {
      setIsGeneratingThumbnail(false)
    }
  }, [excalidrawLoaded])

  // Generate thumbnail when drawing data changes
  useEffect(() => {
    if (!drawingInfo.isEmpty && !drawingInfo.error && drawingInfo.elements.length > 0 && excalidrawLoaded) {
      generateThumbnail(drawingInfo.elements, drawingInfo.appState).then(url => {
        if (url) {
          setThumbnailUrl(url)
        }
      })
    } else {
      setThumbnailUrl(null)
    }
  }, [drawingData, drawingInfo.isEmpty, drawingInfo.error, excalidrawLoaded, generateThumbnail])

  // Export drawing as PNG to clipboard
  const exportDrawingToClipboard = async () => {
    if (!drawingInfo.elements || drawingInfo.elements.length === 0 || !excalidrawLoaded) {
      console.warn('No drawing elements to export or Excalidraw not loaded')
      return
    }

    try {
      setIsExportingToClipboard(true)
      
      const { exportToClipboard } = await import("@excalidraw/excalidraw")
      
      const exportOptions = {
        elements: drawingInfo.elements,
        appState: {
          ...drawingInfo.appState,
          exportBackground: true,
          viewBackgroundColor: "#ffffff",
          exportWithDarkMode: false,
          exportScale: 2,
          exportEmbedScene: false,
        },
        files: null,
        type: "png" as const,
        mimeType: "image/png",
        quality: 0.95,
      }

      await exportToClipboard(exportOptions)
      console.log('Drawing copied to clipboard as PNG!')
      
    } catch (error) {
      console.error('Failed to copy drawing to clipboard:', error)
      
      // Fallback: generate canvas and try manual clipboard
      try {
        const { exportToCanvas } = await import("@excalidraw/excalidraw")
        const canvas = await exportToCanvas({
          elements: drawingInfo.elements,
          appState: {
            ...drawingInfo.appState,
            exportBackground: true,
            viewBackgroundColor: "#ffffff",
            exportWithDarkMode: false,
            exportScale: 2,
          },
          files: null,
          maxWidthOrHeight: 2000,
          exportPadding: 20,
        })
        
        if (canvas && navigator.clipboard && navigator.clipboard.write) {
          canvas.toBlob(async (blob) => {
            if (blob) {
              try {
                await navigator.clipboard.write([
                  new ClipboardItem({ 'image/png': blob })
                ])
                console.log('Drawing copied to clipboard via fallback method!')
              } catch (clipboardError) {
                console.error('Clipboard fallback failed:', clipboardError)
                downloadCanvasAsImage(canvas, 'drawing.png')
              }
            }
          }, 'image/png', 0.95)
        }
      } catch (fallbackError) {
        console.error('All export methods failed:', fallbackError)
      }
    } finally {
      setIsExportingToClipboard(false)
    }
  }

  // Download drawing as PNG
  const downloadDrawingAsPNG = async () => {
    if (!drawingInfo.elements || drawingInfo.elements.length === 0 || !excalidrawLoaded) {
      console.warn('No drawing elements to download or Excalidraw not loaded')
      return
    }

    try {
      const { exportToCanvas } = await import("@excalidraw/excalidraw")
      const canvas = await exportToCanvas({
        elements: drawingInfo.elements,
        appState: {
          ...drawingInfo.appState,
          exportBackground: true,
          viewBackgroundColor: "#ffffff",
          exportWithDarkMode: false,
          exportScale: 2,
        },
        files: null,
        maxWidthOrHeight: 2000,
        exportPadding: 20,
      })
      
      if (canvas) {
        downloadCanvasAsImage(canvas, 'drawing.png')
      }
    } catch (error) {
      console.error('Failed to download drawing:', error)
    }
  }

  // Helper function to download canvas as image
  const downloadCanvasAsImage = (canvas: HTMLCanvasElement, filename: string) => {
    const link = document.createElement('a')
    link.download = filename
    link.href = canvas.toDataURL('image/png', 0.95)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const getElementIcon = (type: string) => {
    const iconMap: any = {
      'rectangle': '⬜',
      'ellipse': '⭕',
      'arrow': '➡️',
      'line': '📏',
      'freedraw': '✏️',
      'text': '📝',
      'image': '🖼️'
    }
    return iconMap[type] || '✏️'
  }

  if (drawingInfo.error) {
    return (
      <div className="my-4 p-4 border border-red-200 rounded-2xl bg-red-50/50">
        <div className="flex items-center space-x-2 text-red-600">
          <X className="w-4 h-4" />
          <div>
            <span className="text-sm font-medium">Invalid drawing data</span>
            <p className="text-xs text-red-500 mt-1">Unable to parse drawing content</p>
          </div>
        </div>
        {onEdit && (
          <div className="mt-3">
            <Button
              onClick={onEdit}
              variant="ghost"
              size="sm"
              className="text-red-600 hover:text-red-700 text-xs"
            >
              <Edit3 className="w-3 h-3 mr-1" />
              Try to edit anyway
            </Button>
          </div>
        )}
      </div>
    )
  }

  if (isPreview) {
    return (
      <div 
        className="my-4 p-4 border border-slate-200 rounded-2xl bg-slate-50/50 hover:bg-slate-100/70 transition-all duration-200 cursor-pointer group" 
        onClick={onEdit}
      >
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <PenTool className="w-4 h-4 text-slate-500" />
            <span className="text-sm text-slate-600 font-medium">Drawing</span>
            {!drawingInfo.isEmpty && (
              <span className="text-xs text-slate-400 bg-slate-200 px-2 py-1 rounded-full">
                {drawingInfo.elementCount} elements
              </span>
            )}
          </div>
          <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
            {!drawingInfo.isEmpty && excalidrawLoaded && (
              <Button
                onClick={(e) => {
                  e.stopPropagation()
                  exportDrawingToClipboard()
                }}
                variant="ghost"
                size="sm"
                className="text-slate-400 hover:text-blue-600 p-1 h-7 w-7"
                disabled={isExportingToClipboard}
                title="Copy to clipboard"
              >
                {isExportingToClipboard ? (
                  <div className="w-3 h-3 animate-spin border-2 border-blue-600 border-t-transparent rounded-full" />
                ) : (
                  <Copy className="w-3 h-3" />
                )}
              </Button>
            )}
            {onEdit && (
              <Button
                onClick={(e) => {
                  e.stopPropagation()
                  onEdit()
                }}
                variant="ghost"
                size="sm"
                className="text-slate-400 hover:text-orange-600 p-1 h-7 w-7"
              >
                <Edit3 className="w-3 h-3" />
              </Button>
            )}
            {onDelete && (
              <Button
                onClick={(e) => {
                  e.stopPropagation()
                  onDelete()
                }}
                variant="ghost"
                size="sm"
                className="text-slate-400 hover:text-red-600 p-1 h-7 w-7"
              >
                <X className="w-3 h-3" />
              </Button>
            )}
          </div>
        </div>
        
        {!drawingInfo.isEmpty ? (
          <div className="h-32 rounded-lg overflow-hidden border border-slate-200 bg-white">
            {thumbnailUrl ? (
              <div className="relative h-full">
                <img 
                  src={thumbnailUrl} 
                  alt="Drawing thumbnail"
                  className="w-full h-full object-contain bg-white"
                  onError={() => {
                    console.error('Failed to load thumbnail image')
                    setThumbnailUrl(null)
                  }}
                />
                <div className="absolute top-2 right-2 bg-black/20 backdrop-blur-sm rounded px-2 py-1">
                  <span className="text-xs text-white font-medium">
                    {drawingInfo.elementCount} elements
                  </span>
                </div>
              </div>
            ) : isGeneratingThumbnail ? (
              <div className="h-full flex items-center justify-center bg-slate-50">
                <div className="text-center">
                  <div className="animate-spin w-6 h-6 border-2 border-orange-500 border-t-transparent rounded-full mx-auto mb-2"></div>
                  <span className="text-xs text-slate-500">Generating preview...</span>
                </div>
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center p-4">
                <div className="flex items-center justify-center space-x-2 mb-2">
                  {Object.entries(drawingInfo.elementTypes).slice(0, 4).map(([type, count]) => (
                    <div key={type} className="flex items-center space-x-1 text-2xl">
                      <span>{getElementIcon(type)}</span>
                      {count as number > 1 && (
                        <span className="text-xs text-slate-500">×{count as number}</span>
                      )}
                    </div>
                  ))}
                </div>
                {drawingInfo.colors.length > 0 && (
                  <div className="flex items-center space-x-1">
                    <Palette className="w-3 h-3 text-slate-400" />
                    <div className="flex space-x-1">
                      {drawingInfo.colors.map((color, index) => (
                        <div
                          key={index}
                          className="w-3 h-3 rounded-full border border-slate-300"
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        ) : (
          <div className="h-32 rounded-lg border-2 border-dashed border-slate-300 flex items-center justify-center bg-white">
            <div className="text-center text-slate-400">
              <PenTool className="w-6 h-6 mx-auto mb-2" />
              <p className="text-sm">Empty drawing</p>
            </div>
          </div>
        )}
        
        <div className="flex items-center justify-center mt-3 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
          <div className="flex items-center space-x-2 text-xs text-slate-500 bg-white/80 px-3 py-1 rounded-full border border-slate-200">
            <Edit3 className="w-3 h-3" />
            <span>Click to edit</span>
          </div>
        </div>
      </div>
    )
  }

  // Rest of the component remains the same for expanded and default views
  // ... (keeping the existing expanded and default view code)

  return (
    <div className="my-4 border border-slate-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200">
      <div className="flex items-center justify-between p-3 bg-gradient-to-r from-slate-50 to-slate-100 border-b border-slate-200">
        <div className="flex items-center space-x-2">
          <PenTool className="w-4 h-4 text-slate-600" />
          <span className="text-sm font-medium text-slate-700">Drawing</span>
          {!drawingInfo.isEmpty && (
            <span className="text-xs text-slate-500 bg-slate-200 px-2 py-1 rounded">
              {drawingInfo.elementCount} elements
            </span>
          )}
        </div>
        <div className="flex items-center space-x-2">
          {!drawingInfo.isEmpty && excalidrawLoaded && (
            <>
              <Button
                onClick={(e) => {
                  e.stopPropagation()
                  exportDrawingToClipboard()
                }}
                variant="ghost"
                size="sm"
                className="text-slate-400 hover:text-blue-600"
                disabled={isExportingToClipboard}
                title="Copy to clipboard as PNG"
              >
                {isExportingToClipboard ? (
                  <div className="w-4 h-4 animate-spin border-2 border-blue-600 border-t-transparent rounded-full" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </Button>
              <Button
                onClick={(e) => {
                  e.stopPropagation()
                  downloadDrawingAsPNG()
                }}
                variant="ghost"
                size="sm"
                className="text-slate-400 hover:text-green-600"
                title="Download as PNG"
              >
                <Download className="w-4 h-4" />
              </Button>
            </>
          )}
          {onEdit && (
            <Button
              onClick={(e) => {
                e.stopPropagation()
                onEdit()
              }}
              variant="ghost"
              size="sm"
              className="text-slate-400 hover:text-orange-600"
            >
              <Edit3 className="w-4 h-4" />
            </Button>
          )}
          <Button
            onClick={(e) => {
              e.stopPropagation()
              setIsExpanded(true)
            }}
            variant="ghost"
            size="sm"
            className="text-slate-400 hover:text-slate-600"
          >
            <Expand className="w-4 h-4" />
          </Button>
        </div>
      </div>
      
      <div
        className="p-6 cursor-pointer hover:bg-slate-50/50 transition-colors relative overflow-hidden bg-white"
        style={{ minHeight: "120px" }}
        onClick={(e) => {
          e.stopPropagation()
          onEdit?.()
        }}
      >
        {!drawingInfo.isEmpty ? (
          <div className="flex flex-col items-center justify-center h-full">
            {thumbnailUrl ? (
              <div className="w-full h-24 mb-3 rounded-lg overflow-hidden border border-slate-200 bg-white">
                <img 
                  src={thumbnailUrl} 
                  alt="Drawing thumbnail"
                  className="w-full h-full object-contain"
                  onError={() => {
                    console.error('Failed to load thumbnail image')
                    setThumbnailUrl(null)
                  }}
                />
              </div>
            ) : isGeneratingThumbnail ? (
              <div className="w-full h-24 mb-3 rounded-lg border border-slate-200 bg-slate-50 flex items-center justify-center">
                <div className="animate-spin w-5 h-5 border-2 border-orange-500 border-t-transparent rounded-full"></div>
              </div>
            ) : (
              <div className="flex items-center justify-center space-x-3 mb-3">
                {Object.entries(drawingInfo.elementTypes).slice(0, 5).map(([type, count]) => (
                  <div key={type} className="flex flex-col items-center">
                    <span className="text-3xl mb-1">{getElementIcon(type)}</span>
                    {count as number > 1 && (
                      <span className="text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded-full">
                        ×{count as number}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}
            
            {drawingInfo.colors.length > 0 && (
              <div className="flex items-center space-x-2 mb-2">
                <Palette className="w-4 h-4 text-slate-400" />
                <div className="flex space-x-1">
                  {drawingInfo.colors.map((color, index) => (
                    <div
                      key={index}
                      className="w-4 h-4 rounded-full border border-slate-300 shadow-sm"
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>
            )}
            
            <div className="flex items-center space-x-2 text-xs text-slate-500 bg-slate-100 px-3 py-1 rounded-full mt-2">
              <Edit3 className="w-3 h-3" />
              <span>Click to edit</span>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-slate-400">
            <PenTool className="w-8 h-8 mb-3" />
            <p className="text-sm mb-2">Empty drawing</p>
            <div className="flex items-center space-x-2 text-xs text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
              <Edit3 className="w-3 h-3" />
              <span>Click to add content</span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
})

DrawingViewer.displayName = "DrawingViewer"

export default DrawingViewer