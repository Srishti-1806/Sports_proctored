"use client"

import { Pencil, X, Play } from 'lucide-react'

export default function VideoCard({ data, onEdit, onDelete }) {
  return (
    <div className="group relative rounded-2xl overflow-hidden border border-border hover:border-primary-bright transition-colors">
      <div className="aspect-video bg-linear-to-br from-primary-deep to-primary-bright flex items-center justify-center relative">
        <Play className="w-12 h-12 text-white" />
        <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button onClick={onEdit} className="p-1.5 bg-popover/90 hover:bg-popover rounded-lg">
            <Pencil className="w-3.5 h-3.5 text-primary-bright" />
          </button>
          <button onClick={onDelete} className="p-1.5 bg-popover/90 hover:bg-popover rounded-lg">
            <X className="w-3.5 h-3.5 text-danger" />
          </button>
        </div>
      </div>
      <div className="p-3">
        <h4 className="font-semibold text-foreground text-sm mb-1">{data.title}</h4>
        {data.description && (
          <p className="text-xs text-muted-foreground line-clamp-2">{data.description}</p>
        )}
      </div>
    </div>
  )
}
