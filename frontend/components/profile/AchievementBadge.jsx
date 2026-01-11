"use client"

import { Trophy, X, Image as ImageIcon } from 'lucide-react'
import { useState } from 'react'

export default function AchievementBadge({ data, onEdit, onDelete, canEdit = true }) {
  const [showImage, setShowImage] = useState(false)

  if (!data) return null

  return (
    <>
      <div className="relative bg-card rounded-xl p-4 shadow-md border border-border hover:shadow-lg transition-all group">
        {canEdit && (onEdit || onDelete) && (
          <div className="absolute bottom-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 z-10">
            {onEdit && (
              <button onClick={(e) => { e.stopPropagation(); onEdit && onEdit(); }} className="p-1.5 hover:bg-popover rounded-lg transition-colors">
                <svg className="w-3.5 h-3.5 text-muted-foreground" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 113 3L7 19l-4 1 1-4 12.5-12.5z"/></svg>
              </button>
            )}
            <button 
              onClick={(e) => { e.stopPropagation(); onDelete && onDelete(); }} 
              className="p-1.5 hover:bg-red-50 rounded-lg"
            >
              <X className="w-3.5 h-3.5 text-red-500" />
            </button>
          </div>
        )}

        <div className="flex gap-4">
          {/* Left: Details (70%) */}
          <div className="w-[70%] flex flex-col justify-between">
            <div className="space-y-2.5">
              <div>
                <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide mb-0.5">Title</p>
                <h4 className="font-bold text-base text-foreground pr-6">{data.title}</h4>
              </div>
              
              {data.event && (
                <div>
                  <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide mb-0.5">Event</p>
                  <p className="text-sm font-medium text-amber-600">{data.event}</p>
                </div>
              )}
              
              {data.year && (
                <div>
                  <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide mb-0.5">Year</p>
                  <p className="text-sm text-foreground">{data.year}</p>
                </div>
              )}
            </div>

            {data.achievementImage && (
              <button 
                onClick={() => setShowImage(true)} 
                className="mt-3 flex items-center gap-1.5 px-3 py-1.5 bg-linear-to-r from-amber-50 to-orange-50 hover:from-amber-100 hover:to-orange-100 rounded-lg transition-colors w-fit"
              >
                <ImageIcon className="w-3.5 h-3.5 text-amber-600" />
                <span className="text-xs font-medium text-amber-600">View Full</span>
              </button>
            )}
          </div>

          {/* Right: Achievement Image/Trophy (30%) */}
          <div className="w-[30%] shrink-0">
            {data.achievementImage ? (
              <div 
                className="w-full aspect-4/3 rounded-lg overflow-hidden cursor-pointer hover:opacity-95 transition-opacity" 
                onClick={() => setShowImage(true)}
              >
                <img 
                  src={data.achievementImage} 
                  alt="Achievement" 
                  className="w-full h-full object-cover" 
                />
              </div>
            ) : (
              <div className="w-full aspect-4/3 flex items-center justify-center rounded-lg bg-linear-to-br from-amber-50 to-orange-50">
                <div className="text-center">
                  <Trophy className="w-8 h-8 text-amber-400 mx-auto mb-1" />
                  <p className="text-[10px] text-amber-600">No image</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Image Modal */}
      {showImage && data.achievementImage && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4" onClick={() => setShowImage(false)}>
          <div className="relative max-w-6xl w-full">
            <button 
              onClick={() => setShowImage(false)} 
              className="absolute -top-12 right-0 p-2 bg-card rounded-lg hover:bg-popover transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            <img 
              src={data.achievementImage} 
              alt="Achievement" 
              className="w-full h-auto max-h-[90vh] object-contain rounded-xl" 
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>
      )}
    </>
  )
}
