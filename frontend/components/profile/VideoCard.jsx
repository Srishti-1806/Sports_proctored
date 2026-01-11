"use client"

import { Pencil, X, Play } from 'lucide-react'
import { useState } from 'react'
import VideoModal from '../VideoModal'

export default function VideoCard({ data, video, onEdit, onDelete, showControls = true }) {
  const item = data ?? video ?? {}
  const title = item.title ?? 'Untitled Video'
  const description = item.description ?? ''
  const url = item.url ?? item.videoUrl ?? ''
  const [open, setOpen] = useState(false)

  return (
    <>
      <div onClick={() => setOpen(true)} className="group relative rounded-2xl overflow-hidden border border-border hover:border-primary-bright transition-colors cursor-pointer">
        <div className="aspect-video bg-linear-to-br from-primary-deep to-primary-bright flex items-center justify-center relative">
          <Play className="w-12 h-12 text-white" />
          {showControls && (
            <div onClick={(e) => e.stopPropagation()} className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <button onClick={onEdit} className="p-1.5 bg-popover/90 hover:bg-popover rounded-lg">
                <Pencil className="w-3.5 h-3.5 text-primary-bright" />
              </button>
              <button onClick={onDelete} className="p-1.5 bg-popover/90 hover:bg-red-50 rounded-lg">
                <X className="w-3.5 h-3.5 text-red-500" />
              </button>
            </div>
          )}
        </div>
        <div className="p-3">
          <h4 className="font-semibold text-foreground text-sm mb-1">{title}</h4>
          {description && (
            <p className="text-xs text-muted-foreground line-clamp-2">{description}</p>
          )}
        </div>
      </div>

      <VideoModal isOpen={open} onClose={() => setOpen(false)} video={{ title, description, url }} />
    </>
  )
}
